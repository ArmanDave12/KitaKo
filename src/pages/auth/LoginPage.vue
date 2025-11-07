<template>
  <q-page class="login-page">
    <!-- Video Background -->
    <div class="video-container">
      <video autoplay loop muted playsinline class="bg-video">
        <source
          src="../../assets/a_cool_cartoon_hacker_character_sitting_at.mp4"
          type="video/mp4"
        />
      </video>
      <div class="video-overlay"></div>
    </div>

    <!-- Mobile-Optimized Content -->
    <div class="mobile-container">
      <!-- Compact Header -->
      <div class="cyber-header">
        <div class="logo-text">KITAKO</div>
        <div class="subtitle">ACCESS_PORTAL</div>
      </div>

      <!-- Login Form -->
      <q-card dark class="cyber-card q-mx-auto">
        <q-card-section class="cyber-card-header">
          <div class="text-kitako-neon-bright cyber-text">
            <q-icon name="login" size="sm" class="q-mr-xs" />
            <span>SYSTEM_ACCESS</span>
          </div>

          <!-- Offline Indicator -->
          <div v-if="!isOnline" class="offline-indicator">
            <q-icon name="wifi_off" size="xs" class="q-mr-xs" />
            <span class="text-caption">OFFLINE_MODE</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-sm">
            <!-- Email Input -->
            <q-input
              v-model="email"
              dense
              filled
              type="email"
              label="Email"
              class="cyber-input"
              bg-color="kitako-dark-3"
              color="kitako-neon-bright"
              input-class="text-white"
              label-color="cyan-2"
              :rules="[(val) => (val && val.length > 0) || 'Email is required']"
              hint-color="pink-3"
            >
              <template v-slot:prepend>
                <q-icon name="email" size="xs" color="kitako-neon-bright" />
              </template>
            </q-input>

            <!-- Password Input -->
            <q-input
              v-model="password"
              dense
              filled
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              class="cyber-input"
              bg-color="kitako-dark-3"
              color="kitako-neon-bright"
              input-class="text-white"
              label-color="cyan-2"
              :rules="[(val) => (val && val.length > 0) || 'Password is required']"
              hint-color="pink-3"
            >
              <template v-slot:prepend>
                <q-icon name="lock" size="xs" color="kitako-neon-bright" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="xs"
                  @click="isPwd = !isPwd"
                  color="kitako-neon-bright"
                />
              </template>
            </q-input>

            <div class="q-mt-md">
              <q-btn
                label="LOGIN"
                type="submit"
                color="kitako-neon-bright"
                text-color="white"
                class="full-width login-btn"
                :loading="loading"
                size="sm"
              />
            </div>
            <div class="text-center row justify-evenly">
              <div class="q-mt-sm text-center" v-if="isOnline">
                <q-btn
                  flat
                  dense
                  color="white"
                  label="GOOGLE LOGIN"
                  @click="loginWithGoogle"
                  :loading="googleLoading"
                  size="sm"
                />
              </div>
              <div class="q-mt-sm text-center">
                <q-btn
                  flat
                  dense
                  color="white"
                  label="CREATE ACCOUNT"
                  no-caps
                  to="/signup"
                  size="sm"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Status Display -->
      <div class="cyber-status">
        <div class="status-item">
          <q-icon
            :name="isOnline ? 'circle' : 'wifi_off'"
            size="8px"
            :color="isOnline ? 'green' : 'orange'"
            class="q-mr-xs"
            :class="{ blink: !isOnline }"
          />
          <span class="text-caption text-cyan-2">{{ isOnline ? 'ONLINE' : 'OFFLINE' }}</span>
        </div>
        <div class="status-item">
          <span class="text-kitako-neon-bright text-caption">v1.1</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Script with improved offline authentication support
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmail, signInWithGoogle } from 'boot/firebase'
import { useQuasar } from 'quasar'
import {
  loginLocalUser,
  initializeOfflineAuth,
  syncLocalUsersToFirebase,
  getCurrentSession,
  syncUserToLocal,
} from '../../services/localAuth'

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)
const googleLoading = ref(false)
const errorMsg = ref('')
const isOnline = ref(navigator.onLine)

// Initialize offline auth system
onMounted(() => {
  initializeOfflineAuth()

  // Setup online/offline event listeners
  window.addEventListener('online', () => {
    console.log('Online status change: ONLINE')
    isOnline.value = true
    // Try to sync any offline registered users
    syncLocalUsersToFirebase()
  })

  window.addEventListener('offline', () => {
    console.log('Online status change: OFFLINE')
    isOnline.value = false
  })

  // Check if we have an active session already
  checkExistingSession()
})

// Check if user is already logged in
async function checkExistingSession() {
  try {
    const session = await getCurrentSession()
    if (session) {
      console.log('Active session found, redirecting to home')
      router.push('/home')
    }
  } catch (error) {
    console.error('Error checking session:', error)
  }
}

// Main login function with improved error-based offline detection
const onSubmit = async () => {
  if (!email.value || !password.value) return

  try {
    loading.value = true

    // Always try Firebase authentication first, regardless of navigator.onLine
    try {
      console.log('Attempting Firebase authentication...')
      const user = await signInWithEmail(email.value, password.value)

      // Success! Save credentials for offline use
      console.log('Firebase login successful, syncing credentials for offline use')
      await syncUserToLocal({
        email: email.value,
        password: password.value,
        displayName: user.displayName || '',
        uid: user.uid,
      })

      // Verify data was saved to IndexedDB
      verifyLocalStorage()

      $q.notify({
        color: 'positive',
        icon: 'check_circle',
        message: 'Login successful',
        position: 'top',
      })

      router.push('/home')
    } catch (firebaseError) {
      console.error('Firebase login error:', firebaseError)

      // Check specifically for network error
      if (firebaseError.code === 'auth/network-request-failed') {
        console.log('Network error detected, switching to offline authentication')

        // Try offline authentication
        await attemptOfflineLogin()
      } else {
        // It's not a network error, just a regular auth error (like wrong password)
        throw firebaseError
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: error.message || 'Login failed. Please try again.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Separate function for offline login
async function attemptOfflineLogin() {
  try {
    console.log('Attempting offline login...')
    const result = await loginLocalUser(email.value, password.value)

    if (result && result.success) {
      console.log('Offline login successful')
      $q.notify({
        color: 'positive',
        icon: 'check_circle',
        message: 'Offline login successful',
        position: 'top',
      })

      router.push('/home')
    } else {
      throw new Error('Offline login failed')
    }
  } catch (offlineError) {
    console.error('Offline login error:', offlineError)

    // Debug IndexedDB to help diagnose the issue
    checkIndexedDBStatus()

    $q.notify({
      color: 'negative',
      icon: 'error',
      message: `Offline login failed: ${offlineError.message}. Have you logged in online first?`,
      position: 'top',
    })

    throw offlineError
  }
}

// Google login - requires internet
const loginWithGoogle = async () => {
  if (!isOnline.value) {
    $q.notify({
      color: 'warning',
      icon: 'wifi_off',
      message: 'Google login is not available in offline mode',
      position: 'top',
    })
    return
  }

  try {
    googleLoading.value = true
    await signInWithGoogle()

    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Login successful',
      position: 'top',
    })
    router.push('/home')
  } catch (error) {
    console.error('Google login error:', error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: error.message || 'Google login failed. Please try again.',
      position: 'top',
    })
  } finally {
    googleLoading.value = false
  }
}

// Helper function to verify data was stored in IndexedDB
function verifyLocalStorage() {
  try {
    const dbRequest = indexedDB.open('kitako-auth-db', 1)
    dbRequest.onsuccess = function (event) {
      const db = event.target.result
      const tx = db.transaction(['users'], 'readonly')
      const store = tx.objectStore('users')
      const getRequest = store.get(email.value)

      getRequest.onsuccess = function () {
        console.log('User stored in IndexedDB:', !!getRequest.result)
        if (getRequest.result) {
          console.log('User has password?', !!getRequest.result.password)
        }
      }
    }
  } catch (error) {
    console.error('Error verifying local storage:', error)
  }
}

// Debug helper function
function checkIndexedDBStatus() {
  try {
    const dbRequest = indexedDB.open('kitako-auth-db', 1)
    dbRequest.onsuccess = function (event) {
      const db = event.target.result
      const tx = db.transaction(['users'], 'readonly')
      const store = tx.objectStore('users')
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = function () {
        console.log('All users in IndexedDB:', getAllRequest.result)

        // Check if this specific user exists
        const getRequest = store.get(email.value)
        getRequest.onsuccess = function () {
          if (getRequest.result) {
            console.log('Found user in DB:', getRequest.result.email)
            console.log('Password stored?', !!getRequest.result.password)
          } else {
            console.log('User not found in IndexedDB:', email.value)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking IndexedDB:', error)
  }
}
</script>

<style scoped>
/* Mobile-First Approach */
.login-page {
  background-color: var(--kitako-dark);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Video Background */
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(30, 30, 30, 0.75) 100%);
}

/* Mobile Container - Centered both vertically and horizontally */
.mobile-container {
  position: relative;
  z-index: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  min-height: 100vh;
  width: 100%;
}

/* Compact Header - Adjust for vertical centering */
.cyber-header {
  text-align: center;
  margin-top: -80px; /* Push up to help with vertical centering */
  padding-bottom: 1.5rem;
}

.logo-text {
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 8px var(--kitako-neon-glow);
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

/* Card Styling */
.cyber-card {
  background-color: var(--kitako-dark-2);
  border-left: 3px solid var(--kitako-neon-bright);
  max-width: 300px;
  margin: 0 auto; /* Center horizontally */
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(177, 74, 237, 0.2);
  /* Add a subtle animation on load */
  animation: card-appear 0.5s ease-out;
}

/* Offline indicator */
.cyber-card-header {
  position: relative;
}

.offline-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: 'Courier New', monospace;
  color: orange;
  display: flex;
  align-items: center;
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cyber-card-header {
  background-color: var(--kitako-dark-3);
  padding: 0.5rem;
  border-bottom: 1px solid rgba(177, 74, 237, 0.3);
}

/* Input Styling */
.cyber-input :deep(.q-field__control) {
  border-left: 2px solid var(--kitako-neon-bright);
  min-height: 40px;
}

/* Improved text colors for cyber theme */
.cyber-input :deep(.q-field__label) {
  color: white !important; /* Bright cyan */
}

.cyber-input :deep(.q-field__native) {
  color: white !important;
}

.cyber-input :deep(input::placeholder) {
  color: rgba(177, 74, 237, 0.6) !important;
}

.cyber-input :deep(.q-field__marginal) {
  color: var(--kitako-neon-bright);
}

/* Login button glow effect */
.login-btn {
  position: relative;
  box-shadow: 0 0 10px rgba(217, 101, 255, 0.5);
}

.login-btn:hover {
  box-shadow: 0 0 15px rgba(217, 101, 255, 0.8);
}

/* Status Bar */
.cyber-status {
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 6px 10px;
  border-top: 1px solid rgba(177, 74, 237, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.status-item {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
}

/* Animation */
.blink {
  animation: blink 3s infinite;
}

@keyframes blink {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

/* Cyber Text */
.cyber-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

/* Media Queries for larger screens */
@media (min-width: 600px) {
  .cyber-card {
    max-width: 400px;
  }

  .logo-text {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .cyber-header {
    margin-top: -100px; /* Adjust for larger screens */
  }
}

/* Smaller screens - adjust vertical centering */
@media (max-height: 600px) {
  .cyber-header {
    margin-top: -40px; /* Less negative margin for smaller height screens */
    padding-bottom: 1rem;
  }
}
</style>
