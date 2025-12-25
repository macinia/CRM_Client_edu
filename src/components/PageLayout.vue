<template>
  <div class="layout">
    <SideBar/>
  <div class="layout-content">
    <HeaderShapka />
    <main class="main">
      <slot />
    </main>
  </div>
  </div>
</template>

<script setup>
import HeaderShapka from './HeaderShapka.vue'
import SideBar from './SideBar.vue';
</script>

<style scoped>
.layout {
  background-color: #f5f5f5f5;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  display: flex;
}
.layout-content {
  height: 100%;
  flex-grow: 1;
}
.main {
  padding: 32px 24px;
  height: fit-content;
  overflow-y: scroll;

}
</style>
