<template>
  <PageLayout>
    <div class="company-top">
      <h1>Сотрудники</h1>

      <button
        v-if="authStore.user?.role === 'admin' || authStore.user?.role === 'manager'"
        @click="openModalCreateEmployer"
      >
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        Сотрудник
      </button>
    </div>

    <div class="copmany-employes">
      <div class="copmany-employes-nav">
        <button
          v-for="section in sections"
          :key="section.role"
          @click="selectRole(section.role)"
          :class="['nav-item', selectedRole === section.role ? 'selected' : '']"
        >
          {{ section.label }} ({{ section.items.length }})
        </button>
      </div>

      <div class="user-list-container">
        <div
          v-for="user in selectedUsers"
          :key="user.id"
          :style="{ backgroundColor: user.color }"
          class="user-card"
        >
          <div class="card-info">
            <div class="info-top">
              <p class="fio">{{ user.surname }} {{ user.name }} {{ user.patronymic }}</p>
              <span>(UTC{{ user.timezone }})</span>
            </div>

            <div class="info-buttom">{{ user.phone }} {{ user.email }}</div>
          </div>

          <div class="card-role">
            {{ getRoleLabel(user.role) }}
          </div>

          <div class="card-action">
            <button v-if="authStore.user?.role === 'admin'" @click="openModalEditEmployer(user)">
              <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import PageLayout from '@/components/PageLayout.vue'
import ModalCreateEmployer from '@/components/ModalCreateEmployer.vue'
import ModalEditEmployer from '@/components/ModalEditEmployer.vue'
import { useEmployersStore } from '@/stores/employers'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const employersStore = useEmployersStore()
const { employers } = storeToRefs(employersStore)

const isOpenModalCreateEmployer = ref(false)
const isOpenModalEditEmployer = ref(false)
const editEmployer = ref(null)
const selectedRole = ref('admin')

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

const selectedUsers = computed(() => {
  const currentSection = sections.value.find((section) => section.role === selectedRole.value)
  return currentSection ? currentSection.items : []
})

const selectRole = (role) => {
  selectedRole.value = role
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
.company-top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #6e6565;
  padding-bottom: 8px;
}
.company-top button {
  background-color: #b49db4;
  border-radius: 56px;
  padding: 8px 24px;
  font-size: 24px;
  align-items: center;
  gap: 8px;
}
.copmany-employes {
  margin-top: 16px;
}
.copmany-employes-nav {
  display: flex;
  border-bottom: 1px solid #6e6565;
  gap: 36px;
}
.nav-item {
  padding: 8px;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  transition: all 0.3s ease;
}
.nav-item:hover {
  opacity: 0.8;
}
.selected {
  font-weight: 600;
  color: #802e87;
  border-bottom: 3px solid #802e87;
}
.plus-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding-top: 4px;
}
.user-list {
  margin-top: 24px;
  height: 131px;
  border-radius: 30px;
  padding: 17px 35px 27px;
}
.user-list-container {
  padding-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-height: 450px;
  overflow-y: auto;
}
.user-card {
  height: 130px;
  gap: 8px;
  display: flex;
  padding: 16px 32px;
  border-radius: 30px;
  flex-shrink: 0;
}
.card-info {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info-top {
  font-weight: 600;
  font-size: 26px;
  display: flex;
  gap: 8px;
}
.fio {
  max-width: 400px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.info-buttom {
  font-weight: 450;
  font-size: 24px;
}
.card-role {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
}
.card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}
.user-role {
  display: flex;
  justify-content: flex-end;
  margin-left: 360px;
  align-content: center;
}
.role-container {
  display: flex;
  align-items: center;
  font-size: 27px;
  font-weight: 600;
  gap: 120px;
}
.edit-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  align-items: center;
}
</style>
