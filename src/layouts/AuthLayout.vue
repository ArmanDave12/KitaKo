<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// No additional logic needed
</script>

<style>
/* Core variables */
:root {
  --kitako-dark: #121212;
  --kitako-dark-1: #1a1a1a;
  --kitako-dark-2: #222222;
  --kitako-dark-3: #2a2a2a;
  --kitako-neon: #b14aed;
  --kitako-neon-bright: #d965ff;
  --kitako-neon-glow: rgba(177, 74, 237, 0.6);
}

/* Minimal styling for auth layout */
.auth-layout {
  background-color: var(--kitako-dark);
  color: #fff;
}

/* Essential color classes */
.text-kitako-neon {
  color: #b14aed !important;
}

.text-kitako-neon-bright {
  color: #d965ff !important;
}

.bg-kitako-dark {
  background-color: #121212 !important;
}

.bg-kitako-dark-1 {
  background-color: #1a1a1a !important;
}

.bg-kitako-dark-2 {
  background-color: #222222 !important;
}

.bg-kitako-dark-3 {
  background-color: #2a2a2a !important;
}

/* Animation for status indicator */
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
</style>
