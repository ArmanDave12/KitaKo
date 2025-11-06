<template>
  <q-page class="kitako-page">
    <!-- Video Background -->
    <div class="video-container">
      <video autoplay loop muted playsinline class="bg-video">
        <source src="../assets/a_cool_cartoon_hacker_character_sitting_at.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="video-overlay"></div>
    </div>

    <!-- Content -->
    <div class="content-wrapper">
      <!-- Header -->
      <div class="kitako-header">
        <div class="kitako-logo">
          <div class="neon-text">KITAKO</div>
          <div class="subtitle">CYBER DASHBOARD</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="kitako-content">
        <!-- Mobile-First Menu -->
        <div class="menu-container">
          <!-- SAHOD VIEWER -->
          <q-btn to="/salary" class="menu-button hover-effect" no-caps align="left">
            <div class="menu-btn-content">
              <q-icon name="attach_money" color="kitako-neon" size="md" class="menu-icon" />
              <div class="menu-text">
                <div class="menu-title">SAHOD VIEWER</div>
                <div class="menu-desc">Track salary & payroll info</div>
              </div>
              <div class="hover-indicator">
                <q-icon name="chevron_right" color="kitako-neon" size="sm" />
              </div>
            </div>
          </q-btn>

          <!-- BUDGET TRACKER -->
          <q-btn to="/budget" class="menu-button hover-effect" no-caps align="left">
            <div class="menu-btn-content">
              <q-icon
                name="account_balance_wallet"
                color="kitako-neon"
                size="md"
                class="menu-icon"
              />
              <div class="menu-text">
                <div class="menu-title">BUDGET TRACKER</div>
                <div class="menu-desc">Manage funds & expenses</div>
              </div>
              <div class="hover-indicator">
                <q-icon name="chevron_right" color="kitako-neon" size="sm" />
              </div>
            </div>
          </q-btn>

          <!-- TIME TRACKER (Disabled) -->
          <q-btn disable class="menu-button menu-button-disabled" no-caps align="left">
            <div class="menu-btn-content">
              <q-icon name="schedule" color="grey-6" size="md" class="menu-icon" />
              <div class="menu-text">
                <div class="menu-title">TIME TRACKER</div>
                <div class="menu-desc">
                  <q-badge color="grey-8" text-color="grey-5" class="q-py-xs">
                    COMING SOON
                  </q-badge>
                </div>
              </div>
            </div>
          </q-btn>
        </div>

        <!-- Status Display -->
        <div class="status-display">
          <div class="status-item">
            <q-icon name="circle" size="10px" color="green" class="q-mr-xs blink" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div class="status-item">
            <span class="text-kitako-neon">KITAKO v1.0</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
</script>

<style>
/* Colors */
:root {
  --kitako-dark: #121212;
  --kitako-dark-2: #1a1a1a;
  --kitako-dark-3: #222222;
  --kitako-neon: rgb(177, 74, 237);
  --kitako-neon-glow: rgba(177, 74, 237, 0.6);
}

/* Global Page Structure */
.kitako-page {
  background-color: var(--kitako-dark);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto; /* Allow vertical scrolling */
}

/* Video Background */
.video-container {
  position: fixed; /* Changed from absolute to fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-video {
  position: absolute;
  top: 0;
  left: -30px;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
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

/* Content wrapper - above the video */
.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* Add padding to account for fixed status bar */
}

/* Header */
.kitako-header {
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.kitako-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(177, 74, 237, 0) 0%,
    rgba(177, 74, 237, 0.7) 50%,
    rgba(177, 74, 237, 0) 100%
  );
}

.kitako-logo {
  text-align: center;
}

.neon-text {
  color: #fff;
  text-shadow:
    0 0 5px var(--kitako-neon-glow),
    0 0 10px var(--kitako-neon-glow);
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 3px;
  margin-bottom: 4px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  letter-spacing: 1px;
}

/* Main Content Area */
.kitako-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* Menu Style */
.menu-container {
  margin-top: 8px;
  margin-bottom: auto;
}

.menu-button {
  background-color: rgba(26, 26, 26, 0.85);
  border-left: 3px solid var(--kitako-neon);
  margin-bottom: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  height: auto;
  min-height: 70px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2px);
}

/* Hover Effect with Neon Glow */
.hover-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(177, 74, 237, 0) 0%, rgba(177, 74, 237, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.hover-effect:hover::before {
  opacity: 1;
}

.hover-effect:hover {
  background-color: rgba(34, 34, 34, 0.9);
  transform: translateX(3px);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(177, 74, 237, 0.2);
}

.hover-effect:hover .menu-title {
  color: var(--kitako-neon);
  text-shadow: 0 0 5px rgba(177, 74, 237, 0.4);
}

.hover-effect:hover .menu-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 3px rgba(177, 74, 237, 0.7));
}

/* Hover indicator chevron */
.hover-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.hover-effect:hover .hover-indicator {
  opacity: 1;
  right: 18px;
}

.menu-button-disabled {
  border-left: 3px solid #444;
  opacity: 0.7;
}

.menu-button-disabled:hover {
  transform: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background-color: rgba(26, 26, 26, 0.85);
}

.menu-button-disabled:hover .menu-title,
.menu-button-disabled:hover .menu-icon {
  color: inherit;
  transform: none;
  filter: none;
  text-shadow: none;
}

.menu-btn-content {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 1;
}

.menu-icon {
  margin-right: 16px;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

.menu-text {
  text-align: left;
  flex: 1;
}

.menu-title {
  color: white;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 4px;
  transition:
    color 0.3s ease,
    text-shadow 0.3s ease;
}

.menu-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

/* Status Display */
.status-display {
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 3px;
  border-top: 1px solid rgba(177, 74, 237, 0.1);
  position: fixed; /* Keep fixed but ensure content doesn't get hidden */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  backdrop-filter: blur(3px);
}

.status-item {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
}

/* Animations */
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

/* Responsive adjustments for very small screens */
@media screen and (max-width: 320px) {
  .kitako-header {
    padding: 16px;
  }

  .neon-text {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .menu-button {
    padding: 8px;
    min-height: 60px;
  }

  .menu-title {
    font-size: 0.9rem;
  }

  .menu-desc {
    font-size: 0.7rem;
  }

  .menu-icon {
    margin-right: 12px;
  }

  .hover-indicator {
    right: 8px;
  }

  .hover-effect:hover .hover-indicator {
    right: 12px;
  }
}

/* Ultra small screen (302px) adjustments */
@media screen and (max-width: 302px) {
  .kitako-content {
    padding: 10px 8px;
  }

  .kitako-header {
    padding: 12px 8px;
  }

  .neon-text {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 0.7rem;
  }

  .menu-button {
    padding: 6px;
  }

  .menu-title {
    font-size: 0.8rem;
  }

  .menu-desc {
    font-size: 0.65rem;
  }

  .menu-icon {
    margin-right: 8px;
    font-size: 1.2rem;
  }

  .status-item {
    font-size: 0.7rem;
  }

  .hover-indicator {
    right: 6px;
  }

  .hover-effect:hover .hover-indicator {
    right: 8px;
  }
}
</style>
