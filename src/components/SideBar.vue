<template>
  <aside class="aside">
    <div class="aside-item logo">EduKrismach</div>
    <RouterLink
      v-for="item in navItems"
      :key="item.label"
      :to="item.url"
      class="aside-item"
      active-class="active"
    >
      <img :src="getImageUrl(item.logoUrl)" class="nav-icon" alt="icon" />
      {{ item.label }}
    </RouterLink>
  </aside>
</template>

<script setup>
const navItems = [
  {
    label: 'Компания',
    logoUrl: 'company.svg',
    url: '/company',
  },
  {
    label: 'Клиенты',
    logoUrl: 'clients.svg',
    url: '/clients',
  },
  {
    label: 'Занятие',
    logoUrl: 'lesson.svg',
    url: '/lessons',
  },
  {
    label: 'Отчеты',
    logoUrl: 'report.svg',
    url: '/report',
  },
  {
    label: 'Финансы',
    logoUrl: 'finances.svg',
    url: '/finances',
  },
]
const getImageUrl = (logoUrl) => {
  return new URL(`/src/assets/${logoUrl}`, import.meta.url).href
}
</script>

<style scoped>
.logo {
  font-size: 24px;
  font-weight: 800;
  background-color: #a871ad;
  height: 90px;
}

.aside {
  background-color: #d9bddb;
  width: 250px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.aside-item {
  padding: 32px 24px;
  font-size: 22px;
  font-weight: 700;
  align-items: flex-start;
  justify-content: center;
  display: flex;
  gap: 12px;
  color: black;
  text-decoration: none;
}
.nav-icon {
  width: 27px;
  height: 27px;
  flex-shrink: 0;
}
.active {
  background-color: #b49db4;
  color: black;
}
</style>
