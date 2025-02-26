<template>
  <header class="d-flex justify-content-between">
    <div>
      <img src="~/assets/img/Personify-Health-Home.png" alt="PH-Image"/>
    </div>
    <div class="headerRight">
      <RouterLink class="blackColor" to="/Dashboard">
        <div class="headerHover"><span>
          <font-awesome-icon icon="fa-solid fa-house"/>
        </span>
          Home
        </div>
      </RouterLink>
      <RouterLink class="blackColor" to="/users">
        <div class="headerHover"><span>
          <font-awesome-icon icon="fa-solid fa-users"/>
          </span> Users
        </div>
      </RouterLink>
      <RouterLink class="blackColor" to="/">
        <div class="headerHover" @click="handleLogout">
          <span>
          <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket"/>
          </span> Log Out
        </div>
      </RouterLink>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useCookie } from '#app'
import { useRouter } from 'vue-router' // Import useRouter
const router = useRouter() // Get the router object
import { useAuthStore } from '~/store/auth'
const authStore = useAuthStore()
// Logout method
const handleLogout = () => {
  authStore.logout() // Call the store's logout method
}

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

<style scoped>
.blackColor {
  color: black;
}
.headerHover {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.headerHover span {
  margin-right: 8px;
}
.headerHover:hover {
  color: red; /* Example hover effect */
}
</style>