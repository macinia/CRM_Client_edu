<template>
  <PageLayout>
    <UiPageHeader
      title="Сотрудники"
      :action-visible="canCreateEmployer"
      action-label="Сотрудник"
      @action="openModalCreateEmployer"
    />

    <UiTabs v-model="selectedRole" :items="tabItems" />

    <UiCardList
      :is-empty="selectedUsers.length === 0"
      empty-text="Сотрудников в этом разделе пока нет"
      max-height="calc(100vh - 280px)"
    >
      <UiCardShell
        v-for="user in selectedUsers"
        :key="user.id"
        :background-color="user.color"
        class="employee-card"
      >
        <div class="employee-main">
          <div class="employee-head">
            <p class="employee-name">
              {{ getFullName(user) }}
            </p>
            <span class="employee-timezone">UTC{{ user.timezone }}</span>
          </div>

          <div class="employee-contacts">
            <span>{{ user.phone || 'Телефон не указан' }}</span>
            <span>{{ user.email || 'Email не указан' }}</span>
          </div>
        </div>

        <div class="employee-role">
          {{ getRoleLabel(user.role) }}
        </div>

        <div v-if="canEditEmployer" class="employee-actions">
          <button class="icon-btn" @click="openModalEditEmployer(user)">
            <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
          </button>
        </div>
      </UiCardShell>
    </UiCardList>

    <ModalCreateEmployer
      :IsOpenModalCreateEmployer="isOpenModalCreateEmployer"
      @closeModalCreateEmployer="closeModalCreateEmployer"
    />

    <ModalEditEmployer
      :isOpenModalEditEmployer="isOpenModalEditEmployer"
      :employerData="editEmployer"
      @closeModalEditEmployer="closeModalEditEmployer"
      @saveEmployer="saveEmployer"
    />
  </PageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'
import ModalCreateEmployer from '@/components/ModalCreateEmployer.vue'
import ModalEditEmployer from '@/components/ModalEditEmployer.vue'

import UiPageHeader from '@/components/ui/UiPageHeader.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiCardList from '@/components/ui/UiCardList.vue'
import UiCardShell from '@/components/ui/UiCardShell.vue'

import { useEmployersStore } from '@/stores/employers'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const employersStore = useEmployersStore()
const { employers } = storeToRefs(employersStore)

const isOpenModalCreateEmployer = ref(false)
const isOpenModalEditEmployer = ref(false)
const editEmployer = ref(null)
const selectedRole = ref('admin')

const canCreateEmployer = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager'
})

const canEditEmployer = computed(() => {
  return authStore.user?.role === 'admin'
})

const sections = computed(() => [
  {
    role: 'admin',
    label: 'Администраторы',
    items: employers.value.filter((item) => item.role === 'admin'),
  },
  {
    role: 'manager',
    label: 'Менеджеры',
    items: employers.value.filter((item) => item.role === 'manager'),
  },
  {
    role: 'teacher',
    label: 'Преподаватели',
    items: employers.value.filter((item) => item.role === 'teacher'),
  },
])

const tabItems = computed(() => {
  return sections.value.map((section) => ({
    value: section.role,
    label: section.label,
    count: section.items.length,
  }))
})

const selectedUsers = computed(() => {
  const currentSection = sections.value.find((section) => section.role === selectedRole.value)
  return currentSection ? currentSection.items : []
})

const getFullName = (user) => {
  return [user.surname, user.name, user.patronymic].filter(Boolean).join(' ')
}

const getRoleLabel = (role) => {
  if (role === 'admin') return 'Администратор'
  if (role === 'manager') return 'Менеджер'
  if (role === 'teacher') return 'Преподаватель'
  return role
}

const openModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = true
}

const closeModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = false
}

const openModalEditEmployer = (employer) => {
  editEmployer.value = { ...employer }
  isOpenModalEditEmployer.value = true
}

const closeModalEditEmployer = () => {
  isOpenModalEditEmployer.value = false
  editEmployer.value = null
}

const saveEmployer = (updatedEmployer) => {
  employersStore.updateEmployer(updatedEmployer)
  closeModalEditEmployer()
}
</script>

<style scoped>
.employee-card {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(180px, 0.8fr) auto;
  align-items: center;
  gap: 20px;
  min-height: 116px;
}

.employee-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.employee-head {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.employee-name {
  min-width: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.employee-timezone {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 6px 10px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.45);
}

.employee-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.employee-role {
  justify-self: center;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text);
}

.employee-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.45);
  transition:
    background-color var(--transition-base),
    transform var(--transition-base);
}

.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.72);
  transform: translateY(-1px);
}

.edit-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
