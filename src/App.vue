<template>
  <div class="app">
    <!-- Боковая панель -->
    <SideBar />
      <RouterView />
    </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue';
</script>

<style>
.app{
  height: 100vh;
  width: 100vw;
  display: flex;
}
</style>
