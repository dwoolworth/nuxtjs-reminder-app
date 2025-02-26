<script setup>
import {ref, reactive} from 'vue'
import Headers from "../../components/Headers"
import Dashboard from "~/components/DashboardPage.vue";
import { useAuthStore } from '~/store/auth'
const components = {
  Headers
}


const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}


  
</script>

<template>
  <Headers/>
  <div>
    <nuxt-route-announcer />
    <Dashboard />
  </div>
</template>

