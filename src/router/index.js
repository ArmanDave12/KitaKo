// router/index.js
import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { getCurrentUser } from 'boot/firebase' // Import your auth function

export default route(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation guard for auth protection
  Router.beforeEach(async (to, from, next) => {
    // Get current authentication state
    const currentUser = await getCurrentUser().catch(() => null)

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const isGuestRoute = to.matched.some((record) => record.meta.guest)

    // Handle root path redirect
    if (to.path === '/') {
      return next(currentUser ? '/home' : '/login')
    }

    if (requiresAuth && !currentUser) {
      // If route requires auth but user isn't logged in, redirect to login
      next('/login')
    } else if (isGuestRoute && currentUser) {
      // If route is for guests only but user is logged in, redirect to home
      next('/home')
    } else {
      // Otherwise proceed normally
      next()
    }

    // Update document title
    if (to.meta.title) {
      document.title = to.meta.title
    }
  })

  return Router
})
