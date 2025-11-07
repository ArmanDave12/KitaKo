// services/combinedLogout.js

import { getAuth, signOut } from 'firebase/auth'
import { openDB } from 'idb'
import { Notify } from 'quasar'

const dbPromise = openDB('kitako-auth-db', 1)
const auth = getAuth()

// The useFirebaseConnectionStatus composable works inside of components,
// but may not work properly in a service file due to Vue composition API limitations
// This variable will be initialized when the logout function is called
let isFirebaseConnected = false

// Function to set the Firebase connection status (called from outside)
export function setFirebaseConnectionStatus(status) {
  isFirebaseConnected = status
  console.log('Logout Service: Firebase connection status updated:', status)
}

export async function logoutUser() {
  console.log('Starting logout process. Firebase connected status:', isFirebaseConnected)

  try {
    // --- 1️⃣ Check Firebase's real connection status and sign out
    if (isFirebaseConnected) {
      try {
        await signOut(auth)
        console.log('✅ Firebase logout successful')
      } catch (err) {
        console.warn('⚠️ Firebase logout failed:', err)
      }
    } else {
      console.log('⚠️ Firebase is offline — skipping online logout')
    }

    // --- 2️⃣ Always clear local session from your custom DB
    try {
      const db = await dbPromise
      await db.delete('session', 'current-session')
      console.log('✅ Local session cleared')
    } catch (err) {
      console.error('❌ Error clearing local session:', err)
    }

    // --- 3️⃣ CRITICAL: Clear Firebase IndexedDB storage - FIXED VERSION
    try {
      // Clear firebaseLocalStorageDb
      const firebaseLocalStorageDb = await openDB('firebaseLocalStorageDb', 1)
      if (firebaseLocalStorageDb.objectStoreNames.contains('firebaseLocalStorage')) {
        await firebaseLocalStorageDb.clear('firebaseLocalStorage')
        console.log('✅ Firebase Local Storage cleared')
      }
      firebaseLocalStorageDb.close()

      // Also clear the firebaseLocalStorage in actual localStorage
      localStorage.removeItem('firebase:authUser:AIzaSyAGic1AVl-JOKGExML_i')
      console.log('✅ Firebase localStorage auth user cleared')

      // Clear IndexedDB database
      const indexedDb = await openDB('IndexedDB', 1)
      if (indexedDb.objectStoreNames.contains('firebaseLocalStorage')) {
        await indexedDb.clear('firebaseLocalStorage')
      }
      indexedDb.close()
    } catch (err) {
      console.warn('⚠️ Could not clear Firebase storage:', err)
    }

    // --- 4️⃣ Also clear kitako-auth-db if it contains auth data
    try {
      const kitakoAuthDb = await openDB('kitako-auth-db', 1)

      // Check if there's a session store
      if (kitakoAuthDb.objectStoreNames.contains('session')) {
        await kitakoAuthDb.clear('session')
      }

      kitakoAuthDb.close()
    } catch (err) {
      console.warn('⚠️ Could not clear kitako-auth-db:', err)
    }

    // --- 5️⃣ Add a small delay to ensure storage operations complete
    await new Promise((resolve) => setTimeout(resolve, 200))

    // --- 6️⃣ Notify user
    Notify.create({
      color: 'positive',
      icon: 'logout',
      message: 'You have been logged out successfully',
      position: 'top',
      timeout: 2500,
    })

    return true
  } catch (error) {
    console.error('❌ Logout process failed:', error)
    Notify.create({
      color: 'negative',
      icon: 'error',
      message: 'Logout failed. Please try again.',
      position: 'top',
    })
    throw error
  }
}
