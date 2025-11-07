// service-worker.js
// Service worker for offline capabilities

const CACHE_NAME = 'kitako-cache-v1'
const OFFLINE_URL = '/offline.html' // Corrected path
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html', // Corrected path
  '/css/app.css',
  '/js/app.js',
  '/fonts/materialdesignicons-webfont.woff2',
  '/favicon.ico',
  '/img/logo.png',
  // Add other critical assets here
]

// Install event - cache key assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )

  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          }),
      )
    }),
  )

  // Claim clients so the SW can control them immediately
  self.clients.claim()
})

// Fetch event - serve from cache if available, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip firebase authentication requests
  if (
    event.request.url.includes('/__/auth/') ||
    event.request.url.includes('firebaseio.com') ||
    event.request.url.includes('googleapis.com')
  ) {
    return
  }

  // For GET requests, try network first, then cache
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses for future offline use
          if (response.status === 200) {
            const clonedResponse = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse)
            })
          }
          return response
        })
        .catch(async () => {
          // Network failed, try the cache
          const cachedResponse = await caches.match(event.request)

          if (cachedResponse) {
            return cachedResponse
          }

          // If it's a page navigation, return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }

          // Can't fulfill the request
          return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          })
        }),
    )
  }
})

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
