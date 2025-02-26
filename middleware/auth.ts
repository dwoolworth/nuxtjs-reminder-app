import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.isLoggedIn) {
      return navigateTo('/login')
    }

  // Allow access to home page if logged in
  console.log(authStore.isLoggedIn)
  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/Dashboard')
  }

  })