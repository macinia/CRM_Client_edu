<template>
  <div class="layout">
    <HeaderShapka />
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import HeaderShapka from './HeaderShapka.vue'
</script>

<style scoped>
.layout {
  background-color: #f5f5f5f5;
  width: 100%;
}
.main {
  padding: 32px 24px;
}
</style>
