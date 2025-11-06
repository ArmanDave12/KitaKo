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
              <div class="q-mt-sm text-center">
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
          <q-icon name="circle" size="8px" color="green" class="q-mr-xs blink" />
          <span class="text-caption text-cyan-2">ONLINE</span>
        </div>
        <div class="status-item">
          <span class="text-kitako-neon-bright text-caption">v1.0</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Script remains the same
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmail, signInWithGoogle } from 'boot/firebase'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)
const googleLoading = ref(false)
const errorMsg = ref('')

const onSubmit = async () => {
  if (!email.value || !password.value) return

  try {
    loading.value = true
    await signInWithEmail(email.value, password.value)
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Login successful',
      position: 'top', // Display at the top of the screen
    })
    router.push('/home')
  } catch (error) {
    console.error('Login error:', error)
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: error.message || 'Login failed. Please try again.',
      position: 'top',
    })
    errorMsg.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const loginWithGoogle = async () => {
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
    errorMsg.value = error.message || 'Google login failed. Please try again.'
  } finally {
    googleLoading.value = false
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
