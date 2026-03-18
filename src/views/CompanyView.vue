<template>
  <PageLayout>
    <div class="company-top">
      <h1>Сотрудники</h1>
      <button
        @click="openModalCreateEmployer()"
        v-if="authStore.user.role == 'admin' || authStore.user.role == 'manager'"
      >
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        Сотрудник
      </button>
    </div>
    <div class="copmany-employes">
      <div class="copmany-employes-nav">
        <button
          v-for="role in sections"
          :key="role.label"
          @click="
            () => {
              sections.forEach((section) => (section.isChoosen = false))
              selectRole(role.array)
              role.isChoosen = true
            }
          "
          :class="['nav-item', role.isChoosen ? 'selected' : ' ']"
        >
          {{ role.label }} ({{ role.array.length }})
        </button>
      </div>
      <div class="user-list-container">
        <div
          v-for="user in selectedUsers"
          :key="user.user.id"
          :style="{ backgroundColor: user.user.hex }"
          class="user-card"
        >
          <div class="card-info">
            <div class="info-top">
              <p class="fio">
                {{ user.user.surname }} {{ user.user.name }} {{ user.user.patronymic }}
              </p>
              (UTC{{ user.user.timezone }})
            </div>
            <div class="info-buttom">{{ user.user.phone }} {{ user.user.email }}</div>
          </div>
          <div class="card-role">
            {{ user.user.role }}
          </div>
          <div class="card-action">
            <button @click="openModalEditEmployer(user)" v-if="authStore.user.role == 'admin'">
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
import PageLayout from '@/components/PageLayout.vue'
import { ref, computed, watch } from 'vue'
import { useEmployersStore } from '@/stores/employers'
import ModalCreateEmployer from '@/components/ModalCreateEmployer.vue'
import { useAuthStore } from '@/stores/auth'
import ModalEditEmployer from '@/components/ModalEditEmployer.vue'
import { storeToRefs } from 'pinia'

const isOpenModalCreateEmployer = ref(false)
const isOpenModalEditEmployer = ref(false)
const editEmployer = ref({})
const selectedRole = ref('SUPERUSER') // Для отслеживания выбранной роли

const authStore = useAuthStore()
const EmployersStore = useEmployersStore()

const { employers } = storeToRefs(EmployersStore)

// Computed свойства для分组 сотрудников по ролям
const groupedUsers = computed(() => {
  const groups = {
    superusers: [],
    manager: [],
    teacher: [],
  }

  if (employers.value && employers.value.length > 0) {
    employers.value.forEach((item) => {
      const user = item.user

      if (user.role === 'Администратор') {
        groups.superusers.push(item)
      } else if (user.role === 'Менеджер') {
        groups.manager.push(item)
      } else if (user.role === 'Преподаватель') {
        groups.teacher.push(item)
      }
    })
  }

  return groups
})

// Секции навигации
const sections = computed(() => [
  {
    label: 'Администратор',
    array: groupedUsers.value.superusers,
    role: 'SUPERUSER',
    isChoosen: selectedRole.value === 'SUPERUSER',
  },
  {
    label: 'Менеджер',
    array: groupedUsers.value.manager,
    role: 'MANAGER',
    isChoosen: selectedRole.value === 'MANAGER',
  },
  {
    label: 'Преподаватель',
    array: groupedUsers.value.teacher,
    role: 'TEACHER',
    isChoosen: selectedRole.value === 'TEACHER',
  },
])

// Выбранные пользователи на основе текущей роли
const selectedUsers = computed(() => {
  switch (selectedRole.value) {
    case 'SUPERUSER':
      return groupedUsers.value.superusers
    case 'MANAGER':
      return groupedUsers.value.manager
    case 'TEACHER':
      return groupedUsers.value.teacher
    default:
      return groupedUsers.value.superusers
  }
})

// Функция выбора роли
const selectRole = (role) => {
  selectedRole.value = role
}

const saveEmployer = (updatedEmployer) => {
  EmployersStore.updateEmployer(updatedEmployer)
}

const closeModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = false
}

const openModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = true
}

const closeModalEditEmployer = () => {
  isOpenModalEditEmployer.value = false
}

const openModalEditEmployer = (employer) => {
  isOpenModalEditEmployer.value = true
  editEmployer.value = employer
}
</script>

<style scoped>
/* Стили остаются без изменений */
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
