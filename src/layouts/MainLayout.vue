<template>
  <q-layout view="lHh Lpr lFf" class="kitako-layout">
    <!-- Status Bar Spacer - Fixed height element to push header down -->
    <div class="status-bar-spacer"></div>

    <!-- Header - Will now appear below the status bar -->
    <q-header elevated class="bg-kitako-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-kitako-neon"
        />

        <q-toolbar-title class="text-kitako-neon">
          <div class="flex items-center">
            <q-icon name="code" class="q-mr-sm text-kitako-neon-bright pulse-slow" size="28px" />
            KitaKo
            <q-badge color="kitako-neon-bright" text-color="kitako-dark" class="q-ml-sm"
              >v1.0</q-badge
            >
          </div>
        </q-toolbar-title>

        <!-- <q-btn flat round dense icon="account_circle" class="text-kitako-neon-bright q-ml-md">
          <q-tooltip>Profile</q-tooltip>
        </q-btn> -->
        <q-btn flat round dense icon="logout" class="text-kitako-neon" @click="logout()">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      class="bg-kitako-dark-2 kitako-drawer"
    >
      <q-list class="cyber-menu">
        <q-item-label header class="text-kitako-neon-bright q-py-md">
          <div class="flex items-center justify-between q-mt-md">
            <div class="text-h6">[ MAIN_MENU ]</div>
            <div class="text-caption cyber-text">SYSTEM.READY</div>
          </div>
        </q-item-label>

        <q-separator dark color="kitako-neon" />

        <q-item clickable v-ripple to="/" active-class="menu-active" :exact="true">
          <q-item-section avatar>
            <q-icon name="home" color="kitako-neon" />
          </q-item-section>
          <q-item-section class="text-kitako-neon">Home</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/salary" active-class="menu-active">
          <q-item-section avatar>
            <q-icon name="payments" color="kitako-neon" />
          </q-item-section>
          <q-item-section class="text-kitako-neon">Sahod Viewer</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/budget" active-class="menu-active">
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" color="kitako-neon" />
          </q-item-section>
          <q-item-section class="text-kitako-neon">Budget</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/history" active-class="menu-active">
          <q-item-section avatar>
            <q-icon name="history" color="kitako-neon" />
          </q-item-section>
          <q-item-section class="text-kitako-neon">Transaction History</q-item-section>
        </q-item>

        <q-separator dark color="kitako-neon" class="q-my-md" />
      </q-list>

      <!-- <div class="absolute-bottom text-center q-pa-md cyber-footer bg-kitako-dark">
        <div class="text-kitako-neon-bright text-caption cyber-text">
          <span class="blink">> </span>SYSTEM_ACCESS_GRANTED
        </div>
        <div class="text-kitako-neon text-caption q-mt-sm">© 2025 KitaKo // SECURE_CONNECTION</div>
      </div> -->
    </q-drawer>

    <q-page-container class="bg-kitako-dark-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { logoutUser, setFirebaseConnectionStatus } from 'src/services/combinedLogout'
import { useFirebaseConnectionStatus } from 'src/composables/useFirebaseConnectionStatus'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const leftDrawerOpen = ref(false)
const router = useRouter()

const { firebaseConnected } = useFirebaseConnectionStatus()
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function logout() {
  try {
    await logoutUser() // Call the imported logout function
    setTimeout(() => {
      router.push('/login')
    }, 500)

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('firebase:') || key.includes('firebase')) {
        localStorage.removeItem(key)
      }
    })
    window.location.reload()
  } catch (error) {
    console.error('Logout error:', error)
    // Show error notification if needed
  }
}

watch(firebaseConnected, (newStatus) => {
  setFirebaseConnectionStatus(newStatus)
})
</script>

<style>
/* Custom KitaKo colors */
:root {
  --kitako-dark: #121212;
  --kitako-dark-1: #1a1a1a;
  --kitako-dark-2: #222222;
  --kitako-neon: #b14aed;
  --kitako-neon-bright: #d965ff;
  --kitako-neon-glow: 0 0 8px rgba(217, 101, 255, 0.7);
  --cyber-font: 'Courier New', monospace;
}

/* Status bar spacer - fixed height element to push header down */
.status-bar-spacer {
  display: block;
  width: 100%;
  height: 30px;
  background-color: var(--kitako-dark);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000; /* Reduced z-index */
}

/* Move the header down to appear below the status bar */
.q-header {
  top: 30px !important; /* Same height as the spacer */
  z-index: 4000; /* Higher than spacer, lower than drawer */
}

/* Adjust the drawer to start below the status bar and header */
.kitako-drawer {
  height: 100% !important;
  z-index: 6000; /* Higher than header and spacer */
  position: absolute !important; /* Changed from relative to absolute */
}

.q-drawer {
  z-index: 6000 !important; /* Ensure drawer component gets proper z-index */
}

.cyber-menu {
  z-index: 7000; /* Ensure menu items appear on top */
  position: relative;
}

/* Main menu heading needs to be above everything */
.q-item-label.header.text-kitako-neon-bright {
  position: relative;
  z-index: 8000; /* Higher than everything else */
}

/* Adjust page container to accommodate the new layout */
.q-page-container {
  padding-top: 86px !important; /* Standard 56px toolbar + 30px spacer */
  z-index: 1000; /* Lower than everything else */
}

/* Add custom classes to Quasar */
.bg-kitako-dark {
  background-color: var(--kitako-dark) !important;
}
.bg-kitako-dark-1 {
  background-color: var(--kitako-dark-1) !important;
}
.bg-kitako-dark-2 {
  background-color: var(--kitako-dark-2) !important;
}
.text-kitako-neon {
  color: var(--kitako-neon) !important;
}
.text-kitako-neon-bright {
  color: var(--kitako-neon-bright) !important;
}
.bg-kitako-neon {
  background-color: var(--kitako-neon) !important;
}
.bg-kitako-neon-bright {
  background-color: var(--kitako-neon-bright) !important;
}

/* Global styles */
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--kitako-dark);
  color: white;
}

/* Hacker effect classes */
.cyber-text {
  font-family: var(--cyber-font);
  letter-spacing: 1px;
}

.cyber-menu .q-item {
  border-left: 2px solid transparent;
  transition: all 0.3s;
  position: relative; /* Add positioning context */
}

.cyber-menu .q-item:hover {
  border-left-color: var(--kitako-neon-bright);
  background-color: rgba(177, 74, 237, 0.1);
}

.menu-active {
  border-left: 2px solid var(--kitako-neon-bright) !important;
  background-color: rgba(177, 74, 237, 0.15) !important;
}

.cyber-footer {
  border-top: 1px solid var(--kitako-neon);
}

/* Animations */
.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes pulse-slow {
  0% {
    text-shadow: 0 0 5px rgba(217, 101, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 15px rgba(217, 101, 255, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(217, 101, 255, 0.3);
  }
}

/* Apply subtle glow to neon elements */
.q-toolbar-title,
.q-btn.text-kitako-neon-bright,
.text-kitako-neon-bright:not(.q-item-label) {
  text-shadow: var(--kitako-neon-glow);
}
</style>
