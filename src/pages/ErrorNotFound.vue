<template>
  <div class="fullscreen-container matrix-effect">
    <div class="error-content text-center">
      <!-- Glitched Error Code -->
      <div class="error-code glitch-text text-kitako-neon-bright">404</div>

      <!-- Terminal Message -->
      <div class="terminal-box q-mb-xl">
        <div class="terminal-header">
          <span class="cyber-text text-kitako-neon">SYSTEM_ERROR.log</span>
          <div class="terminal-controls">
            <span class="control-dot"></span>
            <span class="control-dot"></span>
            <span class="control-dot"></span>
          </div>
        </div>
        <div class="terminal-body cyber-text">
          <div class="error-line">
            <span class="text-kitako-neon">> </span>ERROR:
            <span class="text-negative">PAGE_NOT_FOUND</span>
          </div>
          <div class="error-line">
            <span class="text-kitako-neon">> </span>LOCATION: /{{ getCurrentPath() }}
          </div>
          <div class="error-line">
            <span class="text-kitako-neon">> </span>TIMESTAMP: {{ getCurrentTimestamp() }}
          </div>
          <div class="error-line">
            <span class="text-kitako-neon">> </span>STATUS: Requested resource does not exist in the
            system database
          </div>
          <div class="error-line">
            <span class="text-kitako-neon">> </span>ANALYZING POSSIBLE SOLUTIONS...
          </div>
          <div class="error-line">
            <span class="text-kitako-neon">> </span>RECOMMENDATION: Return to a secure checkpoint
          </div>
          <div class="error-line blink-line">
            <span class="text-kitako-neon">> </span><span class="cursor blink">_</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <q-btn
          class="cyber-btn-primary q-mr-md"
          color="kitako-neon"
          text-color="white"
          unelevated
          to="/"
          label="Return to Home"
          icon="home"
        />
        <q-btn
          class="cyber-btn-outline"
          outline
          color="kitako-neon"
          text-color="kitako-neon-bright"
          @click="goBack"
          label="Go Back"
          icon="arrow_back"
        />
      </div>

      <!-- Circuit Decoration -->
      <div class="circuit-decoration"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Function to go back to previous page
function goBack() {
  window.history.back()
}

// Function to get current path
function getCurrentPath() {
  return window.location.pathname.substring(1) || 'unknown_location'
}

// Function to get formatted timestamp
function getCurrentTimestamp() {
  const now = new Date()
  return now.toISOString().replace('T', ' ').substring(0, 19)
}

// Add console-like effect on mount
onMounted(() => {
  console.log('404 Error: Page not found')
})
</script>

<style scoped>
/* Main container */
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
  overflow: hidden;
}

/* Matrix effect */
.matrix-effect {
  position: relative;
  overflow: hidden;
}

.matrix-effect::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: calc(100% + 20px);
  background:
    radial-gradient(circle at center, rgba(177, 74, 237, 0.1) 0%, transparent 70%),
    linear-gradient(0deg, transparent 0%, rgba(177, 74, 237, 0.05) 50%, transparent 100%);
  animation: matrix-scan 8s linear infinite;
}

@keyframes matrix-scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* Content container */
.error-content {
  width: 90%;
  max-width: 700px;
  position: relative;
  z-index: 10;
  padding: 20px;
}

/* 404 Error code */
.error-code {
  font-size: 14vw;
  line-height: 1;
  font-weight: bold;
  color: #d965ff;
  text-shadow: 0 0 20px rgba(217, 101, 255, 0.8);
  margin-bottom: 20px;
  position: relative;
  letter-spacing: 8px;
}

/* Terminal window */
.terminal-box {
  background-color: #1a1a1a;
  border-radius: 6px;
  border: 1px solid rgba(177, 74, 237, 0.4);
  overflow: hidden;
  width: 100%;
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(177, 74, 237, 0.2);
  margin: 30px 0;
}

.terminal-header {
  background-color: #222222;
  padding: 8px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(177, 74, 237, 0.4);
}

.terminal-controls {
  display: flex;
  align-items: center;
}

.control-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 8px;
  background-color: rgba(177, 74, 237, 0.7);
}

.terminal-body {
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #d8d8d8;
  min-height: 180px;
  text-align: left;
}

.error-line {
  line-height: 1.6;
  margin-bottom: 5px;
}

/* Blinking cursor */
.cursor {
  color: #b14aed;
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* Action buttons */
.action-buttons {
  margin-top: 30px;
}

.cyber-btn-primary {
  box-shadow: 0 0 10px rgba(177, 74, 237, 0.4);
}

.cyber-btn-outline {
  border: 1px solid rgba(177, 74, 237, 0.3);
}

.cyber-btn-outline:hover {
  border: 1px solid #b14aed;
  background-color: rgba(177, 74, 237, 0.1) !important;
}

/* Circuit decoration */
.circuit-decoration {
  position: absolute;
  bottom: -50px;
  left: -50px;
  right: -50px;
  height: 100px;
  background-image:
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 45%,
      rgba(177, 74, 237, 0.1) 45%,
      rgba(177, 74, 237, 0.1) 46%,
      transparent 46%
    ),
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 65%,
      rgba(177, 74, 237, 0.1) 65%,
      rgba(177, 74, 237, 0.1) 66%,
      transparent 66%
    ),
    linear-gradient(
      0deg,
      transparent 0%,
      transparent 35%,
      rgba(177, 74, 237, 0.1) 35%,
      rgba(177, 74, 237, 0.1) 36%,
      transparent 36%
    ),
    linear-gradient(
      0deg,
      transparent 0%,
      transparent 85%,
      rgba(177, 74, 237, 0.1) 85%,
      rgba(177, 74, 237, 0.1) 86%,
      transparent 86%
    ),
    radial-gradient(
      circle at 45% 35%,
      rgba(177, 74, 237, 0.2) 0%,
      rgba(177, 74, 237, 0.2) 5px,
      transparent 5px
    ),
    radial-gradient(
      circle at 65% 85%,
      rgba(177, 74, 237, 0.2) 0%,
      rgba(177, 74, 237, 0.2) 5px,
      transparent 5px
    );
  opacity: 0.5;
  z-index: -1;
}

/* Glitch effect for error code */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: '404';
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
  clip: rect(24px, 550px, 90px, 0);
}

.glitch-text::after {
  left: 2px;
  text-shadow: -2px 0 #ff00ff;
  animation: glitch-effect 2s infinite linear alternate-reverse;
  clip: rect(85px, 550px, 121px, 0);
}

@keyframes glitch-effect {
  0% {
    clip: rect(16px, 550px, 86px, 0);
  }
  20% {
    clip: rect(30px, 550px, 100px, 0);
  }
  40% {
    clip: rect(43px, 550px, 56px, 0);
  }
  60% {
    clip: rect(21px, 550px, 67px, 0);
  }
  80% {
    clip: rect(89px, 550px, 100px, 0);
  }
  100% {
    clip: rect(75px, 550px, 800px, 0);
  }
}

/* Cyber text */
.cyber-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

/* Custom Quasar classes */
.q-mb-xl {
  margin-bottom: 50px;
}

.q-mr-md {
  margin-right: 16px;
}

.text-kitako-neon {
  color: #b14aed !important;
}

.text-kitako-neon-bright {
  color: #d965ff !important;
}

.text-negative {
  color: #ff5252 !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .error-code {
    font-size: 20vw;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
  }

  .action-buttons .q-btn {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .terminal-body {
    font-size: 12px;
  }
}
</style>
