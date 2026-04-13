<template>
  <div class="layout">
    <SideBar />

    <div class="layout-content">
      <HeaderShapka />

      <main class="main">
        <div class="main-inner">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import HeaderShapka from './HeaderShapka.vue'
import SideBar from './SideBar.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background-color: var(--color-bg);
}

.layout-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 24px;
}

.main-inner {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
}
</style>
