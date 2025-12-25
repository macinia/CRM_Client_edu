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
            } "
          :class="['nav-item', role.isChoosen ? 'selected' : ' ']"
        >
          {{ role.label }} ({{ role.array.length }})
        </button>
      </div>
      <div class="user-list-container">
        <div v-for="user in selectedUsers"
         :key="user.id"
         :style="{ backgroundColor: user.hex }"
         class="user-card">
        <div class="card-info">
          <div class="info-top">
            <p class="fio"> {{ user.surname }} {{ user.name }} {{ user.patronymic }}  </p>
             (UTC{{ user.timezone }})

          </div>
          <div class="info-buttom">
            {{ user.phone }} {{ user.email }}
          </div>

        </div>
        <div class="card-role">
          {{ user.role }}
        </div>
        <div class="card-action">
          <button>
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

const selectedUsers = ref(
 []
)

const selectRole = (array) => {
  sections.value.forEach((el) => {
    el.isChoosen = array === el.role
  })
  selectedUsers.value=array
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
  selectedUsers.value =  sections.value[0].array
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
  padding-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-height: 450px;
  overflow-y: auto;
}
.user-card{
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
 justify-content: space-between
}

.info-top{
  font-weight: 600;
  font-size: 26px;
  display: flex;
  gap: 8px;
}
.fio{
  max-width: 400px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.info-buttom{
  font-weight: 450;
  font-size: 24px;
}
.card-role{
  flex-grow: 1;
display: flex;
align-items: center;
justify-content: center;
font-size: 28px;
font-weight: 600;
}
.card-action{
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
