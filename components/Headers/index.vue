<template>
  <header class="d-flex justify-content-between">
    <div>
      <img src="~/assets/img/Personify-Health-Home.png" alt="PH-Image"/>
    </div>
    <div class="headerRight">
      <RouterLink class="blackColor" to="/home">
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
        <div class="headerHover">
          <span>
          <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket"/>
          </span> Log Out
        </div>
      </RouterLink>
    </div>
  </header>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
</script>