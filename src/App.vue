<template>
  <router-view v-if="!isLoading" />
  <splash-screen v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from 'boot/firebase'
import SplashScreen from './components/SplashScreen.vue'

const router = useRouter()
const isLoading = ref(true)

onMounted(async () => {
  try {
    // Check if user is logged in
    const user = await getCurrentUser()

    // Simulate app loading time
    setTimeout(() => {
      isLoading.value = false

      // Navigate based on auth state
      if (!user && router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    }, 5000) // Reduced to 3 seconds for better UX
  } catch (error) {
    console.error('Auth check failed:', error)
    isLoading.value = false
    router.push('/login')
  }
})
</script>
