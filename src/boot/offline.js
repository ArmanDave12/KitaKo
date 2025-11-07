// boot/offline.js
// This file initializes offline capabilities for the app

import { boot } from 'quasar/wrappers'
import {
  initializeOfflineAuth,
  syncLocalUsersToFirebase,
  syncUserToLocal,
  getCurrentSession,
  registerLocalUser,
  loginLocalUser,
} from '../services/localAuth'
import {
  registerWithEmail as firebaseRegister,
  signInWithEmail as firebaseSignIn,
  signInWithGoogle as firebaseSignInWithGoogle,
} from './firebase'
import { Notify } from 'quasar'
import { useFirebaseConnectionStatus } from 'src/composables/useFirebaseConnectionStatus'
import { watch, ref } from 'vue'

// This boot file initializes offline functionality
export default boot(async ({ app }) => {
  console.log('Initializing offline capabilities')

  // Get Firebase connection status
  const { firebaseConnected } = useFirebaseConnectionStatus()
  console.log('Firebase connection status:', firebaseConnected.value)

  // Create a ref to expose the connection status to the app
  const isOnline = ref(firebaseConnected.value)

  // Add to global properties so it can be accessed throughout the app
  app.config.globalProperties.$isOnline = isOnline

  // Watch for changes in Firebase connection
  watch(firebaseConnected, (val) => {
    console.log('[Firebase .info/connected]', val ? 'Connected' : 'Disconnected')

    // Update our online status based on Firebase connection
    isOnline.value = val

    // Update UI to reflect online/offline status
    updateOnlineStatus(val)

    Notify.create({
      message: val ? 'Firebase reconnected ✅' : 'Firebase disconnected 🚫',
      color: val ? 'positive' : 'warning',
      position: 'top',
    })
  })

  initializeOfflineAuth()

  // Keep reference to original Firebase functions
  const originalSignIn = firebaseSignIn
  const originalGoogleSignIn = firebaseSignInWithGoogle
  const originalRegister = firebaseRegister

  // Override the Firebase register function to also save credentials locally
  app.config.globalProperties.$registerWithEmail = async (email, password, displayName) => {
    try {
      // Check if we're connected to Firebase
      if (!isOnline.value) {
        console.log('Firebase disconnected, using local registration')
        return app.config.globalProperties.$offlineRegister(email, password, displayName)
      }

      // First try Firebase registration
      console.log('Attempting Firebase registration')
      const user = await originalRegister(email, password, displayName)

      console.log('Firebase registration successful, syncing to local storage')

      // After successful registration, save credentials for offline login
      await syncUserToLocal({
        email,
        password, // Will be encrypted in syncUserToLocal
        displayName: displayName || '',
        uid: user.uid,
      })

      Notify.create({
        message: 'Account created and saved for offline use',
        color: 'positive',
        position: 'bottom',
        timeout: 2000,
      })

      return user
    } catch (error) {
      console.error('Online registration error:', error)

      // If it's a network error, try offline registration
      if (error.code === 'auth/network-request-failed') {
        console.log('Network error detected, switching to offline registration')
        return app.config.globalProperties.$offlineRegister(email, password, displayName)
      }

      // For other errors, throw them up
      throw error
    }
  }

  // Helper method for offline registration
  app.config.globalProperties.$offlineRegister = async (email, password, displayName) => {
    console.log('Using offline registration')
    try {
      const result = await registerLocalUser(email, password, displayName)

      Notify.create({
        message: 'Offline account created. Will sync when online.',
        color: 'info',
        icon: 'cloud_upload',
        position: 'top',
        timeout: 3000,
      })

      return result.user
    } catch (offlineError) {
      console.error('Offline registration failed:', offlineError)
      throw offlineError
    }
  }

  // Override the Firebase sign-in function to also save credentials locally
  app.config.globalProperties.$signInWithEmail = async (email, password) => {
    try {
      // First check if we're connected to Firebase
      if (!isOnline.value) {
        console.log('Firebase disconnected, trying offline login')
        return app.config.globalProperties.$offlineLogin(email, password)
      }

      // Try Firebase sign in
      const user = await originalSignIn(email, password)

      console.log('Firebase login successful, syncing to local storage')

      // After successful login, save credentials for offline login
      await syncUserToLocal({
        email,
        password, // Will be encrypted in syncUserToLocal
        displayName: user.displayName || '',
        uid: user.uid,
      })

      Notify.create({
        message: 'Credentials saved for offline use',
        color: 'positive',
        position: 'bottom',
        timeout: 2000,
      })

      return user
    } catch (error) {
      console.error('Online login error, trying offline login:', error)

      // If Firebase connection failed, try to use local authentication
      if (!isOnline.value || error.code === 'auth/network-request-failed') {
        try {
          const result = await app.config.globalProperties.$offlineLogin(email, password)
          return result.user
        } catch (offlineError) {
          console.error('Offline login failed:', offlineError)
          throw offlineError
        }
      }

      // If we're connected but login failed for other reasons, throw the original error
      throw error
    }
  }

  // Helper method for offline login
  app.config.globalProperties.$offlineLogin = async (email, password) => {
    return loginLocalUser(email, password)
  }

  // Override Google sign-in method as well
  app.config.globalProperties.$signInWithGoogle = async () => {
    if (!isOnline.value) {
      Notify.create({
        message: 'Google login requires Firebase connection',
        color: 'warning',
        position: 'top',
      })
      throw new Error('Cannot perform Google login while disconnected from Firebase')
    }

    const user = await originalGoogleSignIn()

    // Note: We don't save Google auth for offline login because
    // we can't securely store Google auth tokens
    Notify.create({
      message: 'Google login successful, but offline login with Google is not supported',
      color: 'info',
      position: 'bottom',
      timeout: 3000,
    })

    return user
  }

  // Update online/offline status based on Firebase connection
  const updateOnlineStatus = (isConnected) => {
    document.body.classList.toggle('app-offline', !isConnected)

    if (!isConnected) {
      Notify.create({
        message: 'Firebase disconnected. Limited functionality available.',
        color: 'warning',
        icon: 'wifi_off',
        position: 'top',
        timeout: 3000,
      })
    }
  }

  // Setup additional online/offline event listeners
  // These are kept as a backup and to handle network changes
  window.addEventListener('online', async () => {
    // We don't immediately change status here - we wait for Firebase
    // connection to confirm via the firebaseConnected watcher

    Notify.create({
      message: 'Network connection detected. Reconnecting to Firebase...',
      color: 'info',
      icon: 'wifi',
      position: 'top',
      timeout: 2000,
    })
  })

  window.addEventListener('offline', () => {
    // When network goes offline, immediately update UI
    // This provides faster feedback than waiting for Firebase timeout
    document.body.classList.add('app-offline')

    Notify.create({
      message: 'Network connection lost. Using locally stored data.',
      color: 'warning',
      icon: 'wifi_off',
      position: 'top',
      timeout: 3000,
    })
  })

  // Initialize online/offline status based on current Firebase connection
  updateOnlineStatus(isOnline.value)

  // Check if we have an active offline session already
  getCurrentSession().then((session) => {
    if (session) {
      console.log('Active offline session found:', session.email)
    }
  })

  // Sync users when Firebase reconnects
  watch(isOnline, async (newValue, oldValue) => {
    // Only run when transitioning from offline to online
    if (newValue === true && oldValue === false) {
      try {
        const syncedCount = await syncLocalUsersToFirebase(firebaseRegister)
        if (syncedCount > 0) {
          Notify.create({
            message: `Synced ${syncedCount} offline accounts to cloud`,
            color: 'positive',
            position: 'bottom',
            timeout: 3000,
          })
        }
      } catch (error) {
        console.error('Error syncing local users:', error)
      }
    }
  })
})
