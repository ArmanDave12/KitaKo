// src/composables/useFirebaseConnectionStatus.js
import { getDatabase, ref, onValue } from 'firebase/database'
import { ref as vueRef } from 'vue'

const firebaseConnected = vueRef(false)

export function useFirebaseConnectionStatus() {
  try {
    const db = getDatabase()
    const connectedRef = ref(db, '.info/connected')

    onValue(connectedRef, (snapshot) => {
      const val = snapshot.val()
      firebaseConnected.value = !!val
      console.log('[Firebase] connected:', firebaseConnected.value)
    })
  } catch (err) {
    console.warn('[Firebase] Connection monitor failed to init:', err)
  }

  return { firebaseConnected }
}
