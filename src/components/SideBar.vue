<template>
  <aside class="aside">
    <div class="logo">EduKrismach</div>

    <nav class="nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.url"
        class="aside-item"
        active-class="active"
      >
        <img :src="getImageUrl(item.logoUrl)" class="nav-icon" :alt="item.label" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentRole = computed(() => authStore.user?.role || null)

const navItems = computed(() => {
  const role = currentRole.value

  return [
    {
      label: 'Компания',
      logoUrl: 'company.svg',
      url: '/company',
      isVisible: true,
    },
    {
      label: 'Клиенты',
      logoUrl: 'clients.svg',
      url: '/clients',
      isVisible: true,
    },
    {
      label: 'Занятия',
      logoUrl: 'lesson.svg',
      url: '/lessons',
      isVisible: true,
    },
    {
      label: 'Отчеты',
      logoUrl: 'report.svg',
      url: '/report',
      isVisible: role === 'admin' || role === 'manager',
    },
    {
      label: 'Финансы',
      logoUrl: 'finances.svg',
      url: '/finances',
      isVisible: role === 'admin',
    },
  ].filter((item) => item.isVisible)
})

const getImageUrl = (logoUrl) => {
  return new URL(`/src/assets/${logoUrl}`, import.meta.url).href
}
</script>

<style scoped>
.aside {
  width: var(--sidebar-width);
  min-height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
}

.logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 26px;
  font-weight: 800;
  background-color: var(--color-sidebar-accent);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 12px;
}

.aside-item {
  min-height: 52px;
  padding: 12px 14px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  transition:
    background-color var(--transition-base),
    transform var(--transition-base);
}

.aside-item:hover {
  background-color: rgba(128, 46, 135, 0.08);
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.active {
  background-color: rgba(128, 46, 135, 0.14);
  color: var(--color-primary);
}
</style>
