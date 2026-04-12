<template>
  <div class="app">
    {{ authStore.user }}
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<style>
.app {
  min-height: 100vh;
  height: fit-content;
  width: 100vw;
}
</style>
