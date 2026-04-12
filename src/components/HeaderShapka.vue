<template>
  <header class="header">
    <div class="header-left">
      <img src="@/assets/header.svg" alt="icon" class="header-icon" />
      <h1 class="header-title">{{ pageTitle }}</h1>
    </div>

    <div class="profile-wrap" ref="profileRef">
      <button class="profile-trigger" @click="toggleProfile">
        <div class="profile-avatar">
          {{ initials }}
        </div>

        <div class="profile-meta">
          <div class="profile-name">{{ fullName }}</div>
          <div class="profile-role-badge">{{ roleLabel }}</div>
        </div>
      </button>

      <div v-if="isProfileOpen" class="profile-dropdown">
        <div class="profile-card-top">
          <div class="profile-avatar large">
            {{ initials }}
          </div>

          <div class="profile-card-info">
            <div class="profile-card-name">{{ fullName }}</div>
            <div class="profile-card-role">{{ roleLabel }}</div>
          </div>
        </div>

        <div class="profile-card-fields">
          <div class="profile-field">
            <span class="profile-field-label">Почта</span>
            <span class="profile-field-value">{{ currentUser?.email || '—' }}</span>
          </div>

          <div class="profile-field">
            <span class="profile-field-label">Телефон</span>
            <span class="profile-field-value">{{ currentUser?.phone || '—' }}</span>
          </div>
        </div>

        <button class="logout-btn" @click="handleLogout">Выйти</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isProfileOpen = ref(false)
const profileRef = ref(null)

const currentUser = computed(() => authStore.user || null)

const pageTitle = computed(() => {
  const titles = {
    '/company': 'Компания',
    '/clients': 'Клиенты',
    '/lessons': 'Занятия',
    '/report': 'Отчеты',
    '/finances': 'Финансы',
  }

  return titles[route.path] || 'Главная'
})

const fullName = computed(() => {
  const user = currentUser.value

  if (!user) return 'Гость'

  return [user.surname, user.name].filter(Boolean).join(' ') || user.email || 'Пользователь'
})

const initials = computed(() => {
  const user = currentUser.value

  if (!user) return '??'

  const first = user.name?.[0] || ''
  const second = user.surname?.[0] || ''

  return `${second}${first}`.toUpperCase() || '??'
})

const roleLabel = computed(() => {
  const roleMap = {
    admin: 'Администратор',
    manager: 'Менеджер',
    teacher: 'Преподаватель',
  }

  return roleMap[currentUser.value?.role] || 'Пользователь'
})

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

const closeProfile = () => {
  isProfileOpen.value = false
}

const handleClickOutside = (event) => {
  if (!profileRef.value) return

  if (!profileRef.value.contains(event.target)) {
    closeProfile()
  }
}

const handleLogout = () => {
  authStore.logout()
  closeProfile()
  router.push('/')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  height: var(--header-height);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background-color: var(--color-header);
  border-bottom: 1px solid var(--color-border);
}

.header-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text);
}

.profile-wrap {
  position: relative;
  flex-shrink: 0;
}

.profile-trigger {
  min-height: 52px;
  padding: 8px 10px 8px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  background-color: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  transition: background-color var(--transition-base);
}

.profile-trigger:hover {
  background-color: var(--color-primary-soft);
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-avatar.large {
  width: 56px;
  height: 56px;
  font-size: 18px;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.profile-name {
  max-width: 180px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  text-align: left;
}

.profile-role-badge {
  padding: 4px 8px;
  border-radius: 999px;
  background-color: rgba(128, 46, 135, 0.1);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  padding: 16px;
  border-radius: 20px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  z-index: 50;
}

.profile-card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.profile-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-card-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
}

.profile-card-role {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.profile-card-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-field-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.profile-field-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  word-break: break-word;
}

.logout-btn {
  width: 100%;
  margin-top: 16px;
  min-height: 46px;
  border-radius: 14px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.logout-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}
</style>
