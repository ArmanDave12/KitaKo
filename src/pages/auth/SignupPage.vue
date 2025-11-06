<template>
  <q-page class="signup-page">
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
        <div class="subtitle">USER_REGISTRATION</div>
      </div>

      <!-- Signup Form -->
      <q-card dark class="cyber-card q-mx-auto">
        <q-card-section class="cyber-card-header">
          <div class="text-kitako-neon cyber-text">
            <q-icon name="person_add" size="sm" class="q-mr-xs" />
            <span>CREATE_ACCOUNT</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-sm">
            <!-- Name Input -->
            <q-input
              v-model="name"
              dense
              filled
              type="text"
              label="Display Name"
              class="cyber-input"
              bg-color="kitako-dark-3"
              color="kitako-neon"
              input-class="text-white"
              label-color="light-blue-1"
              :rules="[(val) => (val && val.length > 0) || 'Name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person" size="xs" color="kitako-neon-bright" />
              </template>
            </q-input>

            <!-- Email Input -->
            <q-input
              v-model="email"
              dense
              filled
              type="email"
              label="Email"
              class="cyber-input"
              bg-color="kitako-dark-3"
              color="kitako-neon"
              input-class="text-white"
              label-color="light-blue-1"
              :rules="[(val) => (val && val.length > 0) || 'Email is required']"
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
              color="kitako-neon"
              input-class="text-white"
              label-color="light-blue-1"
              :rules="[
                (val) => (val && val.length >= 6) || 'Password must be at least 6 characters',
              ]"
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
                label="CREATE ACCOUNT"
                type="submit"
                color="kitako-neon-bright"
                class="full-width login-btn"
                :loading="loading"
                size="sm"
              />
            </div>

            <div class="q-mt-sm text-center">
              <q-btn
                flat
                dense
                no-caps
                class="cyber-return-btn"
                label="⮌ BACK TO LOGIN"
                size="sm"
                @click="router.push('/login')"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <div class="cyber-status">
        <div class="status-item">
          <q-icon name="circle" size="8px" color="green" class="q-mr-xs blink" />
          <span class="text-caption">ONLINE</span>
        </div>
        <div class="status-item">
          <span class="text-kitako-neon text-caption">v1.0</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerWithEmail } from 'boot/firebase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)
const errorMsg = ref('')

const onSubmit = async () => {
  if (!name.value || !email.value || !password.value) return

  try {
    loading.value = true
    await registerWithEmail(email.value, password.value, name.value)

    // Success notification
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Account created successfully!',
      position: 'top',
    })

    router.push('/home') // Redirect to home page after signup
  } catch (error) {
    console.error('Signup error:', error)

    // Error notification
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: error.message || 'Signup failed. Please try again.',
      position: 'top',
      timeout: 5000,
    })

    errorMsg.value = error.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Mobile-First Approach */
.signup-page {
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

/* Mobile Container */
.mobile-container {
  position: relative;
  z-index: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

/* Compact Header */
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
  border-left: 3px solid var(--kitako-neon);
  max-width: 300px;
  margin: 0.5rem auto;
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
}

/* Input Styling */
.cyber-input :deep(.q-field__control) {
  border-left: 2px solid var(--kitako-neon);
  min-height: 40px;
}

/* Improved text colors for cyber theme */
.cyber-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.8) !important;
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

.login-btn {
  position: relative;
  box-shadow: 0 0 10px rgba(217, 101, 255, 0.5);
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
}

.cyber-return-btn {
  color: var(--kitako-neon-bright);
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  position: relative;
  transition: all 0.3s ease;
  text-shadow: 0 0 6px rgba(177, 74, 237, 0.6);
}

.cyber-return-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(177, 74, 237, 0.4);
  border-radius: 4px;
  opacity: 0;
  transition:
    opacity 0.3s,
    box-shadow 0.3s;
}

/* .cyber-return-btn:hover::before {
  opacity: 1;
  box-shadow: 0 0 12px rgba(217, 101, 255, 0.6);
} */

/* .cyber-return-btn:hover {
  color: white;
  text-shadow: 0 0 10px rgba(217, 101, 255, 1);
} */
</style>
