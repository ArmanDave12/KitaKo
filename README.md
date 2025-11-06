# KitaKo App - Dark Purple Neon Hacker Theme

This document explains how to integrate the dark purple neon hacker theme into your Quasar application.

## File Structure

```
src/
├── assets/
│   └── kitako-theme.css      # Global theme CSS file
├── components/
│   └── SplashScreen.vue      # Splash screen component
├── layouts/
│   └── MainLayout.vue        # Main app layout with side menu
└── pages/
    └── SahodViewer.vue       # Sahod Viewer page with themed UI
```

## Installation Steps

1. First, copy the files to their appropriate locations in your project structure.

2. Add the custom color definitions to your Quasar configuration file:

```js
// quasar.conf.js or quasar.config.js
return {
  framework: {
    config: {
      brand: {
        primary: '#b14aed',
        secondary: '#10e5c5',
        accent: '#ff4081',
        dark: '#121212',
        'kitako-dark': '#121212',
        'kitako-dark-1': '#1a1a1a',
        'kitako-dark-2': '#222222',
        'kitako-neon': '#b14aed',
        'kitako-neon-bright': '#d965ff',
        // ...other colors
      },
    },
  },
}
```

3. Import the main CSS theme file in your app's main.js or similar entry file:

```js
// main.js or similar
import './assets/kitako-theme.css'
```

4. Configure your router to include the updated routes:

```js
// router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/sahod',
        component: () => import('pages/SahodViewer.vue'),
      },
      // Add other routes here
    ],
  },
  {
    path: '/splash',
    component: () => import('components/SplashScreen.vue'),
  },
  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]
```

5. Configure your app to show the splash screen on startup:

```js
// App.vue or similar
<template>
  <router-view v-if="!isLoading" />
  <splash-screen v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SplashScreen from './components/SplashScreen.vue'

const isLoading = ref(true)

onMounted(() => {
  // Simulate app loading time
  setTimeout(() => {
    isLoading.value = false
  }, 3000) // Show splash screen for 3 seconds
})
</script>
```

6. Update your index.html to include a suitable font (optional but recommended):

```html
<!-- index.html -->
<head>
  <!-- ... -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <!-- ... -->
</head>
```

## Additional Customization

### App Title and Icon

To complete the KitaKo brand, update your app title and icon:

```html
<!-- index.html -->
<title>KitaKo | Secure Financial Tracker</title>
```

### Custom Material Icons

For a more cyberpunk feel, consider using additional Material Icons that match the hacker theme:

- `code` - For code/technical sections
- `security` - For secure sections
- `memory` - For system components
- `bug_report` - For error reports
- `terminal` - For command-line style features
- `flash_on` - For quick actions

### Theme Variants

You might want to create alternate color schemes for different app sections:

- **Primary Theme**: Dark purple with neon purple (#b14aed) accents
- **Secondary Theme**: Dark background with teal (#10e5c5) accents
- **Warning Theme**: Dark background with orange (#ff9800) accents

## Best Practices

1. Maintain contrast ratios for accessibility - ensure text is readable against dark backgrounds
2. Avoid overuse of animations that can cause performance issues
3. Use the cyber-text class selectively for better readability
4. Test on multiple devices to ensure the theme looks good on different screen sizes

## Additional Components

The theme includes several custom styled components:

- **Cyber cards** - Cards with subtle neon borders
- **Cyber buttons** - Buttons with special hover effects
- **Matrix background** - For splash screens and loading screens
- **Glitch text** - For important headings and titles
- **Circuit patterns** - For decorative UI elements

Use these components consistently throughout your app for a cohesive look.
