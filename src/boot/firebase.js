// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { getDatabase, ref, set, get, onValue, update, serverTimestamp } from 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getDatabase(app)
const googleProvider = new GoogleAuthProvider()

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google', error)
    throw error
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('Error signing in with email', error)
    throw error
  }
}

export const registerWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }
    return userCredential.user
  } catch (error) {
    console.error('Error registering with email', error)
    throw error
  }
}

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject,
    )
  })
}

// Database functions for collaboration
export const saveBudgetToFirebase = (userId, budgetId, budgetData) => {
  const budgetRef = ref(db, `users/${userId}/budgets/${budgetId}`)
  return set(budgetRef, {
    ...budgetData,
    lastUpdated: serverTimestamp(),
  })
}

export const getBudgetFromFirebase = async (userId, budgetId) => {
  const budgetRef = ref(db, `users/${userId}/budgets/${budgetId}`)
  const snapshot = await get(budgetRef)
  return snapshot.val()
}

export const syncBudgets = (userId, updateCallback) => {
  const budgetsRef = ref(db, `users/${userId}/budgets`)
  return onValue(budgetsRef, (snapshot) => {
    const data = snapshot.val() || {}
    updateCallback(data)
  })
}

export const saveSalaryToFirebase = (userId, salaryData) => {
  const salaryRef = ref(db, `users/${userId}/salary`)
  return set(salaryRef, {
    ...salaryData,
    lastUpdated: serverTimestamp(),
  })
}

export const syncSalary = (userId, updateCallback) => {
  const salaryRef = ref(db, `users/${userId}/salary`)
  return onValue(salaryRef, (snapshot) => {
    const data = snapshot.val()
    updateCallback(data)
  })
}

// Collaboration functions
export const shareWithUser = async (userId, targetEmail, resourceType, resourceId) => {
  try {
    // First, find user by email
    // This would typically be done through a Cloud Function in Firebase
    // For this example, we'll simulate it by saving to a shares collection
    const shareRef = ref(db, `shares/${userId}/${resourceType}/${resourceId}`)
    await set(shareRef, {
      sharedWith: targetEmail,
      sharedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error('Error sharing with user', error)
    throw error
  }
}

export { app, auth, db }
