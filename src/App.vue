<template>
  <div class="app">
    {{ authStore.user }}
    <RouterView />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()
onMounted(() => {
  authStore.checkAuthUser()
})
</script>

<style>
.app {
  min-height: 100vh;
  height: fit-content;
  width: 100vw;
}
</style>
