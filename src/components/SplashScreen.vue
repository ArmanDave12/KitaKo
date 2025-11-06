<template>
  <div class="fullscreen-container">
    <div class="matrix-effect">
      <div class="splash-container text-center">
        <!-- Glitch Logo -->
        <div class="logo-container q-mb-lg">
          <div class="glitch-logo">
            <div
              class="logo-text text-h1 text-weight-bold text-kitako-neon-bright cyber-text glitch-text"
            >
              KitaKo
            </div>
            <div class="circuit-lines"></div>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div class="loading-container q-mb-md">
          <div class="cyber-loading-bar">
            <div class="loading-progress" :style="{ width: `${loadingProgress}%` }"></div>
          </div>
          <div class="text-caption text-kitako-neon q-mt-xs cyber-text">
            Loading... {{ loadingProgress }}%
          </div>
        </div>

        <!-- Hacker-style Loading Messages -->
        <div class="loading-messages text-left q-mt-lg">
          <div v-for="(message, index) in displayedMessages" :key="index" class="message-line">
            <span class="text-kitako-neon cyber-text">> </span>
            <span class="message-text cyber-text text-grey-5">{{ message }}</span>
          </div>
          <!-- Active typing line with cursor -->
          <div v-if="currentTyping" class="message-line">
            <span class="text-kitako-neon cyber-text">> </span>
            <span class="message-text cyber-text text-grey-5">{{ currentTyping }}</span>
            <span class="cursor blink">_</span>
          </div>
        </div>

        <!-- Version Info -->
        <div class="version-info text-caption text-grey-6 q-mt-xl">
          <div class="cyber-text">KitaKo v1.0.3 | SECURE_MODE</div>
          <div class="text-kitako-neon-bright q-mt-xs">© 2025 | All Rights Reserved</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Loading progress simulation
const loadingProgress = ref(0)

// Terminal-like messages
const allMessages = [
  'Initializing system...',
  'Establishing secure connection...',
  'Loading modules: core_system ✓',
  'KitaKo system ready!',
]

// For storing completed messages
const displayedMessages = ref([])
// For storing the currently typing message
const currentTyping = ref('')
// Current message index
const currentMessageIndex = ref(0)

// Simulate loading progress
onMounted(() => {
  simulateLoading()
  startTypingAnimation()
})

function simulateLoading() {
  const totalDuration = 5000 // Total duration in ms (5 seconds)
  const interval = 50 // Update every 50ms for smooth animation
  const steps = totalDuration / interval
  const incrementPerStep = 100 / steps

  const loadingTimer = setInterval(() => {
    if (loadingProgress.value >= 100) {
      clearInterval(loadingTimer)
      // No need to navigate here - the App.vue will handle it
    } else {
      loadingProgress.value = Math.min(100, loadingProgress.value + incrementPerStep)
    }
  }, interval)
}

function startTypingAnimation() {
  if (currentMessageIndex.value >= allMessages.length) return

  const message = allMessages[currentMessageIndex.value]
  let charIndex = 0
  currentTyping.value = ''

  const typeInterval = setInterval(() => {
    if (charIndex < message.length) {
      // Add one character at a time
      currentTyping.value += message[charIndex]
      charIndex++
    } else {
      // Message complete
      clearInterval(typeInterval)

      // Add completed message to displayed messages
      displayedMessages.value.push(currentTyping.value)
      // Clear current typing
      currentTyping.value = ''
      // Move to next message
      currentMessageIndex.value++

      // Start next message after a short delay
      setTimeout(() => {
        startTypingAnimation()
      }, 400)
    }
  }, 30)
}
</script>

<style scoped>
/* Critical full-screen styles */
.fullscreen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.matrix-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.matrix-effect::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: calc(100% + 20px);
  background: linear-gradient(0deg, transparent 0%, rgba(177, 74, 237, 0.1) 50%, transparent 100%);
  animation: matrix-scan 3s linear infinite;
}

.splash-container {
  width: 90%;
  max-width: 600px;
  padding: 20px;
  position: relative;
  z-index: 10;
}

.logo-container {
  position: relative;
  margin-bottom: 40px;
}

.glitch-logo {
  position: relative;
  padding: 20px 0;
}

.logo-text {
  position: relative;
  z-index: 2;
  letter-spacing: 4px;
  color: #d965ff;
  text-shadow: 0 0 15px rgba(217, 101, 255, 0.8);
  animation: logo-pulse 2s ease-in-out infinite;
}

@keyframes logo-pulse {
  0% {
    text-shadow: 0 0 10px rgba(217, 101, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(217, 101, 255, 0.9);
  }
  100% {
    text-shadow: 0 0 10px rgba(217, 101, 255, 0.5);
  }
}

.circuit-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 49.5%,
      rgba(177, 74, 237, 0.2) 49.5%,
      rgba(177, 74, 237, 0.2) 50.5%,
      transparent 50.5%
    ),
    linear-gradient(
      180deg,
      transparent 0%,
      transparent 49.5%,
      rgba(177, 74, 237, 0.2) 49.5%,
      rgba(177, 74, 237, 0.2) 50.5%,
      transparent 50.5%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(177, 74, 237, 0.3) 0%,
      rgba(177, 74, 237, 0.3) 10%,
      transparent 10.5%
    );
  z-index: 1;
  opacity: 0.5;
}

.loading-container {
  margin: 40px auto;
  width: 100%;
}

.cyber-loading-bar {
  height: 8px;
  background-color: rgba(177, 74, 237, 0.1);
  border: 1px solid rgba(177, 74, 237, 0.4);
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 2px;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #b14aed 0%, #d965ff 100%);
  transition: width 0.3s ease;
  position: relative;
  box-shadow: 0 0 10px rgba(177, 74, 237, 0.7);
}

.loading-messages {
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(177, 74, 237, 0.3);
  padding: 15px;
  min-height: 200px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  width: 100%;
}

.message-line {
  margin-bottom: 8px;
  line-height: 1.4;
  color: #d8d8d8;
}

.cursor {
  color: #b14aed;
}

.version-info {
  position: relative;
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid rgba(177, 74, 237, 0.2);
  width: 100%;
}

/* Animations */
@keyframes matrix-scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: 'KitaKo';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  left: -2px;
  text-shadow: 2px 0 #00ffff;
  animation: glitch-effect 3s infinite linear alternate-reverse;
  clip: rect(44px, 385px, 56px, 0);
}

.glitch-text::after {
  left: 2px;
  text-shadow: -2px 0 #ff00ff;
  animation: glitch-effect 2s infinite linear alternate-reverse;
  clip: rect(24px, 385px, 36px, 0);
}

@keyframes glitch-effect {
  0% {
    clip: rect(16px, 385px, 86px, 0);
  }
  5.8823529412% {
    clip: rect(75px, 385px, 46px, 0);
  }
  11.7647058824% {
    clip: rect(24px, 385px, 92px, 0);
  }
  17.6470588235% {
    clip: rect(46px, 385px, 15px, 0);
  }
  23.5294117647% {
    clip: rect(31px, 385px, 96px, 0);
  }
  29.4117647059% {
    clip: rect(14px, 385px, 38px, 0);
  }
  35.2941176471% {
    clip: rect(64px, 385px, 81px, 0);
  }
  41.1764705882% {
    clip: rect(90px, 385px, 3px, 0);
  }
  47.0588235294% {
    clip: rect(89px, 385px, 69px, 0);
  }
  52.9411764706% {
    clip: rect(0px, 385px, 23px, 0);
  }
  58.8235294118% {
    clip: rect(70px, 385px, 100px, 0);
  }
  64.7058823529% {
    clip: rect(37px, 385px, 19px, 0);
  }
  70.5882352941% {
    clip: rect(40px, 385px, 11px, 0);
  }
  76.4705882353% {
    clip: rect(75px, 385px, 42px, 0);
  }
  82.3529411765% {
    clip: rect(97px, 385px, 93px, 0);
  }
  88.2352941176% {
    clip: rect(91px, 385px, 83px, 0);
  }
  94.1176470588% {
    clip: rect(29px, 385px, 92px, 0);
  }
  100% {
    clip: rect(2px, 385px, 30px, 0);
  }
}

/* Cyber text style */
.cyber-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

/* Dark theme colors (fallback if CSS variables not set) */
:root {
  --kitako-dark: #121212;
  --kitako-dark-1: #1a1a1a;
  --kitako-dark-2: #222222;
  --kitako-neon: #b14aed;
  --kitako-neon-bright: #d965ff;
  --kitako-neon-glow: 0 0 8px rgba(217, 101, 255, 0.7);
}

/* Class equivalents for the CSS vars (backup) */
.text-kitako-neon {
  color: #b14aed !important;
}

.text-kitako-neon-bright {
  color: #d965ff !important;
}

.bg-kitako-dark {
  background-color: #121212 !important;
}

.text-h1 {
  font-size: 3.5rem;
  line-height: 1.2;
}

.text-weight-bold {
  font-weight: bold;
}

.q-mb-lg {
  margin-bottom: 24px;
}

.q-mb-md {
  margin-bottom: 16px;
}

.q-mt-xs {
  margin-top: 4px;
}

.q-mt-lg {
  margin-top: 24px;
}

.q-mt-xl {
  margin-top: 32px;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-caption {
  font-size: 0.75rem;
  line-height: 1.33;
}

.text-grey-5 {
  color: #9e9e9e !important;
}

.text-grey-6 {
  color: #757575 !important;
}
</style>
