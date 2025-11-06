// // Create a file: src/services/syncService.js
// // This will handle syncing between localStorage and Firebase
// import { db } from '../boot/firebase.js'
// import { ref, onValue, set, update, serverTimestamp } from 'firebase/database'

// export const syncBudgets = (userId, localBudgets, updateLocalCallback) => {
//   const budgetsRef = ref(db, `users/${userId}/budgets`)

//   // Listen for changes from Firebase
//   onValue(budgetsRef, (snapshot) => {
//     const data = snapshot.val() || {}
//     // Update local state
//     updateLocalCallback(data)
//   })
// }

// export const saveBudgetToFirebase = (userId, budgetId, budgetData) => {
//   const budgetRef = ref(db, `users/${userId}/budgets/${budgetId}`)
//   return set(budgetRef, {
//     ...budgetData,
//     lastUpdated: serverTimestamp(),
//   })
// }
