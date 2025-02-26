<script setup>
import { defineAsyncComponent } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const Headers = defineAsyncComponent(() => import('@/components/Headers/index.vue'))
const Dashboard = defineAsyncComponent(() => import('@/components/DashboardPage.vue'))

</script>

<template>
  <div>
    <Headers />
    <Dashboard />
  </div>
</template>