<template>

  <header class="header">
    <div class="header-item">
      <img src="@/assets/header.svg" alt="icon" class="header-icon" />
      {{ pageTitle }}
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/company': 'Компания',
    '/clients': 'Клиенты',
    '/lessons': 'Занятие',
    '/report': 'Отчеты',
    '/finances': 'Финансы',
  }

  return titles[route.path] || 'Главная'
})
</script>

<style scoped>
.header {
  background-color: #d9bddb;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;
  gap: 8px;
}
.header-item {
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  align-items: center;
  margin-left: 40px;
  display: flex;
  gap: 8px;
}
.header-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}
</style>
