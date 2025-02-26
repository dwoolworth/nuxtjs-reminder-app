<template>
  <div class="flex flex-row gap-1">
    <WeatherCard />
    <ReminderList />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const WeatherCard = defineAsyncComponent(() => import('./WeatherCard.vue'))
const ReminderList = defineAsyncComponent(() => import('./ReminderList.vue'))

export default {
  name: 'Dashboard',
}
</script>
