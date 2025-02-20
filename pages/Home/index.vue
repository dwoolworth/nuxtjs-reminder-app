<script setup>
import {ref, reactive} from 'vue'
import Headers from "../../components/Headers"
import Dashboard from "~/components/DashboardPage.vue";
  definePageMeta({
    layout: "default",
  });
  definePageMeta({
    middleware: "auth",
  })
</script>

<template>
  <div>
    <nuxt-route-announcer />
    <Dashboard />
  </div>
</template>

