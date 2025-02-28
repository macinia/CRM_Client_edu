<template>
  <PageLayout>
    <div class="company-top">
      <h1>Сотрудники</h1>
      <button @click="openModalCreateEmployer()">
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
          :class="['user-list']"
          :style="{ backgroundColor: user.hex }"
          v-if="sections.find((el) => el.role === 'TEACHER' && el.isChoosen)"
          v-for="user in users.teacher"
          :key="user.id"
        >
          <div class="row">
            <div class="column">
              <div class="user-style">
                {{ user.surname }} {{ user.name }} {{ user.patronymic }} (UTC{{ user.timezone }})
              </div>
              <div class="row contact">
                <div>{{ user.phone }}</div>
                <div class="email">{{ user.email }}</div>
              </div>
            </div>
            <div class="column user-role">
              <div class="role-container">
                <span>{{ user.role }}</span>
                <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
              </div>
            </div>
          </div>
        </div>
        <div
          :class="['user-list']"
          :style="{ backgroundColor: user.hex }"
          v-if="sections.find((el) => el.role === 'SUPERUSER' && el.isChoosen)"
          v-for="user in users.superusers"
          :key="user.id"
        >
          <div class="row">
            <div class="column">
              <div class="user-style">
                {{ user.surname }} {{ user.name }} {{ user.patronymic }} (UTC{{ user.timezone }})
              </div>
              <div class="row contact">
                <div>{{ user.phone }}</div>
                <div class="email">{{ user.email }}</div>
              </div>
            </div>
            <div class="column user-role">
              <div class="role-container">
                <span>{{ user.role }}</span>
                <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
              </div>
            </div>
          </div>
        </div>
        <div
          :class="['user-list']"
          :style="{ backgroundColor: user.hex }"
          v-if="sections.find((el) => el.role === 'MANAGER' && el.isChoosen)"
          v-for="user in users.manager"
          :key="user.id"
        >
          <div class="row">
            <div class="column">
              <div class="user-style">
                {{ user.surname }} {{ user.name }} {{ user.patronymic }} (UTC{{ user.timezone }})
              </div>
              <div class="row contact">
                <div>{{ user.phone }}</div>
                <div class="email">{{ user.email }}</div>
              </div>
            </div>
            <div class="column user-role">
              <div class="role-container">
                <span>{{ user.role }}</span>
                <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalCreateEmployer
      :IsOpenModalCreateEmployer="isOpenModalCreateEmployer"
      @closeModalCreateEmployer="closeModalCreateEmployer"
    />
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import { onMounted, ref, watch } from 'vue'
import { useEmployersStore } from '@/stores/employers'
import ModalCreateEmployer from '@/components/ModalCreateEmployer.vue'

const isOpenModalCreateEmployer = ref(false)

const EmployersStore = useEmployersStore()

const closeModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = false
}

const openModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = true
}

const users = ref({
  teacher: [],
  manager: [],
  superusers: [],
})

const sections = ref([
  {
    label: 'Администратор',
    array: users.value.superusers,
    role: 'SUPERUSER',
    isChoosen: true,
  },
  {
    label: 'Менеджер',
    array: users.value.manager,
    isChoosen: false,
    role: 'MANAGER',
  },
  {
    label: 'Преподаватель',
    array: users.value.teacher,
    isChoosen: false,
    role: 'TEACHER',
  },
])

const selectRole = (array) => {
  sections.value.forEach((el) => {
    el.isChoosen = array === el.role
  })
}
const getUsers = (data) => {
  let currentUsers = {
    teacher: [],
    manager: [],
    superusers: [],
  }
  data.forEach(({ user }) => {
    if (user.role === 'Администратор') {
      currentUsers.superusers.push(user)
    } else if (user.role === 'Преподаватель') {
      currentUsers.teacher.push(user)
    } else if (user.role === 'Менеджер') {
      currentUsers.manager.push(user)
    }
  })
  sections.value[0].array=currentUsers.superusers
  sections.value[1].array=currentUsers.manager
  sections.value[2].array=currentUsers.teacher
  users.value = currentUsers
}

watch(() => {
  getUsers(EmployersStore.employers)
})

onMounted(async () => {
  getUsers(EmployersStore.employers)
})
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
  margin: 0 25px;
}
.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.email {
  margin-left: 20px;
}

.contact {
  margin-top: 25px;
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
