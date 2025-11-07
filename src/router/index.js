// In your router/index.js file (not routes.js)
import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { getCurrentSession } from '../services/localAuth' // Add this import
import { getCurrentUser } from '../boot/firebase' // Adjust based on your firebase setup

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Add this navigation guard
  Router.beforeEach(async (to, from, next) => {
    // For routes requiring authentication
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // Try online authentication first
      try {
        const user = await getCurrentUser()
        if (user) {
          // User is authenticated online
          next()
          return
        }
      } catch (error) {
        console.log('Firebase auth check failed, trying local auth:', error)
      }

      // If online auth failed, try offline authentication
      try {
        const session = await getCurrentSession()
        if (session) {
          // User is authenticated offline
          next()
          return
        }
      } catch (error) {
        console.error('Error checking offline auth:', error)
      }

      // Not authenticated, redirect to login
      next('/login')
    }
    // For guest-only routes (like login, signup)
    else if (to.matched.some((record) => record.meta.guest)) {
      // Check if already logged in (online)
      try {
        const user = await getCurrentUser()
        if (user) {
          // Already logged in, redirect to home
          next('/home')
          return
        }
      } catch (error) {
        console.log('Firebase guest check failed, trying local session:', error)
      }

      // Check if logged in offline
      try {
        const session = await getCurrentSession()
        if (session) {
          // Already logged in offline, redirect to home
          next('/home')
          return
        }
      } catch (error) {
        console.error('Error checking offline guest status:', error)
      }

      // Not logged in, proceed to the guest route
      next()
    } else {
      // Route doesn't require auth or is not guest-only, proceed
      next()
    }
  })

  return Router
})
