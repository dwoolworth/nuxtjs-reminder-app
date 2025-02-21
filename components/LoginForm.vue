<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import { useAuthStore } from '~/store/auth'  // Assuming you have this store

const authStore = useAuthStore()

const loginForm = reactive({
  email: "",
  password: ""
})

const errorMessage = ref('')
const isLoading = ref(false)

const formSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    await authStore.login(loginForm.email, loginForm.password)
    router.push("/home")
  } catch (error) {
    console.error("Login failed", error)
    errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
    <div class="loginBox boxShadow">
      <img src="~/assets/img/PH-logo.png" alt="PH-logo">
      <h4 class="title mt-3">Sign in to PH Intellect</h4>
  
      <form @submit.prevent="formSubmit" style="width: 90%;">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div class="d-flex flex-column mt-2">
          <label for="email" class="label">Email</label>
          <input type="text" v-model="loginForm.email" id="email" required />
        </div>
        <div class="d-flex flex-column mt-2">
          <label for="password" class="label">Password</label>
          <input type="password" v-model="loginForm.password" id="password" required />
        </div>
        <div>
          <RouterLink class="link" to="forgotPassword">Forgot Password?</RouterLink>
        </div>
        <div class="text-center mt-4">
          <button type="submit" class="button primaryBtn" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Send' }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <style scoped>
  .error-message {
    color: red;
    margin-bottom: 10px;
  }
  </style>