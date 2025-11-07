// localAuth.js
// This service provides offline authentication capabilities

import { openDB } from 'idb'
import { Notify } from 'quasar'
import CryptoJS from 'crypto-js'

// Firebase connection status from global state
// This will be set from offline.js boot file
let isFirebaseConnected = false

// Initialize the IndexedDB database
const dbPromise = openDB('kitako-auth-db', 1, {
  upgrade(db) {
    // Create a store for user data
    const userStore = db.createObjectStore('users', {
      keyPath: 'email',
    })
    userStore.createIndex('email', 'email', { unique: true })

    // Create a store for the currently logged in user
    db.createObjectStore('session', {
      keyPath: 'id',
    })

    // Create a store for pending registrations (users registered offline)
    db.createObjectStore('pendingRegistrations', {
      keyPath: 'email',
    })
  },
})

// Secret key for simple encryption (in a real app, use a more secure approach)
const SECRET_KEY = 'kitako-secret-key-2025'

// Encrypt sensitive data
function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

// Decrypt sensitive data
function decrypt(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Set the Firebase connection status from outside (will be called by offline.js)
export function setFirebaseConnectionStatus(status) {
  isFirebaseConnected = status
  console.log('LocalAuth: Firebase connection status updated:', status)
}

// Check if we're online - using Firebase connection status
export function isOnline() {
  return isFirebaseConnected
}

/**
 * Save user data to IndexedDB for offline login
 * @param {Object} userData - User data from Firebase
 */
export async function syncUserToLocal(userData) {
  try {
    if (!userData || !userData.email) {
      console.error('Invalid user data for local sync')
      return
    }

    const db = await dbPromise
    // Save basic user data and encrypted credentials
    const userToSave = {
      email: userData.email,
      displayName: userData.displayName || '',
      // Only save the password if provided in the userData
      password: userData.password ? encrypt(userData.password) : null,
      lastSynced: new Date().toISOString(),
      // Add other user data you want to store offline
    }

    await db.put('users', userToSave)
    console.log('User data synced to local database')

    // Remove from pending registrations if it was there
    try {
      await db.delete('pendingRegistrations', userData.email)
      console.log('Removed from pending registrations')
    } catch (err) {
      // It's ok if it wasn't in pending registrations
    }

    return true
  } catch (error) {
    console.error('Error syncing user data locally:', error)
    return false
  }
}

/**
 * Register a user locally (for offline first-time registration)
 */
export async function registerLocalUser(email, password, displayName) {
  try {
    const db = await dbPromise

    // Check if user already exists
    const existingUser = await db.get('users', email)
    if (existingUser) {
      throw new Error('User already exists locally')
    }

    // Create new user record
    const newUser = {
      email,
      displayName: displayName || '',
      password: encrypt(password),
      lastSynced: new Date().toISOString(),
      isLocalOnly: true, // Flag indicating this user was created while offline
    }

    await db.put('users', newUser)

    // Add to pending registrations for later sync
    const pendingReg = {
      email,
      displayName: displayName || '',
      password: encrypt(password),
      createdAt: new Date().toISOString(),
    }
    await db.put('pendingRegistrations', pendingReg)

    // Create an active session
    await setActiveSession(newUser)

    return {
      success: true,
      user: {
        email,
        displayName,
        isLocalOnly: true,
      },
    }
  } catch (error) {
    console.error('Local registration error:', error)
    throw error
  }
}

/**
 * Authenticate a user using local data when offline
 */
export async function loginLocalUser(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const db = await dbPromise
    const user = await db.get('users', email)

    if (!user) {
      throw new Error('User not found in local database')
    }

    // If no password stored (e.g., Google login user), cannot login offline
    if (!user.password) {
      throw new Error('No local password available. Online login required.')
    }

    // Verify password
    const decryptedPassword = decrypt(user.password)
    if (password !== decryptedPassword) {
      throw new Error('Incorrect password')
    }

    // Set active session
    await setActiveSession(user)

    // Return user data (exclude sensitive info)
    return {
      success: true,
      user: {
        email: user.email,
        displayName: user.displayName,
        isOfflineLogin: true,
        isLocalOnly: user.isLocalOnly || false,
      },
    }
  } catch (error) {
    console.error('Local login error:', error)
    throw error
  }
}

/**
 * Set active user session
 */
async function setActiveSession(user) {
  try {
    const db = await dbPromise
    const sessionData = {
      id: 'current-session',
      email: user.email,
      displayName: user.displayName,
      loginTime: new Date().toISOString(),
      isOfflineLogin: !isOnline(),
      isLocalOnly: user.isLocalOnly || false,
    }

    await db.put('session', sessionData)
    return true
  } catch (error) {
    console.error('Error setting active session:', error)
    return false
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const db = await dbPromise
    return await db.get('session', 'current-session')
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}

/**
 * Clear current session (logout)
 */
export async function clearSession() {
  try {
    const db = await dbPromise
    await db.delete('session', 'current-session')
    return true
  } catch (error) {
    console.error('Error clearing session:', error)
    return false
  }
}

/**
 * Sync local-only users with Firebase once back online
 * This should be called when internet connection is restored
 */
export async function syncLocalUsersToFirebase(firebaseRegisterFn) {
  try {
    console.log('Syncing local-only users to Firebase...')
    if (!isOnline() || !firebaseRegisterFn) {
      console.log('Cannot sync - offline or missing registration function')
      return 0
    }

    const db = await dbPromise

    // Get all pending registrations that need to be synced
    const pendingRegistrations = await db.getAll('pendingRegistrations')
    console.log(`Found ${pendingRegistrations.length} pending registrations to sync`)

    let syncedCount = 0

    for (const registration of pendingRegistrations) {
      try {
        console.log(`Syncing registration for ${registration.email}`)
        const decryptedPassword = decrypt(registration.password)

        // Try to register this user with Firebase
        await firebaseRegisterFn(registration.email, decryptedPassword, registration.displayName)

        // Update the user's local record to indicate it's no longer local-only
        const user = await db.get('users', registration.email)
        if (user) {
          user.isLocalOnly = false
          await db.put('users', user)
        }

        // Remove from pending registrations
        await db.delete('pendingRegistrations', registration.email)

        syncedCount++

        Notify.create({
          color: 'positive',
          icon: 'cloud_upload',
          message: `User ${registration.email} synchronized to cloud`,
          position: 'top',
          timeout: 3000,
        })
      } catch (error) {
        console.error(`Failed to sync registration for ${registration.email}:`, error)

        // If it's because the user already exists, we can remove from pending
        if (error.code === 'auth/email-already-in-use') {
          console.log(
            `User ${registration.email} already exists in Firebase, removing from pending`,
          )
          await db.delete('pendingRegistrations', registration.email)
        }
      }
    }

    return syncedCount
  } catch (error) {
    console.error('Error during user sync to Firebase:', error)
    return 0
  }
}

/**
 * Get all pending registrations
 */
export async function getPendingRegistrations() {
  try {
    const db = await dbPromise
    const registrations = await db.getAll('pendingRegistrations')
    return registrations.map((reg) => ({
      email: reg.email,
      displayName: reg.displayName,
      createdAt: reg.createdAt,
    }))
  } catch (error) {
    console.error('Error getting pending registrations:', error)
    return []
  }
}

/**
 * Initial setup - call this when your app starts
 * We no longer need the connectivity listeners as we use Firebase connection status
 */
export function initializeOfflineAuth() {
  // Use default online status (false) until properly set by offline.js
  isFirebaseConnected = false
  console.log('Offline authentication initialized - using Firebase connection status')
}
