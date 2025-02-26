<script setup>
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()
auth.init()
</script>

<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>
