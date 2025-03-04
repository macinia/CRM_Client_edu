<template>
  <PageLayout>
    <div class="clients-top">
      <h1>Наши клиенты</h1>
      <button @click="openModalCreateClient()">
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        Клиент
      </button>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Введите ФИО клиента"
          class="search-input"
        />
        <img src="@/assets/search.svg" class="search-icon" />
      </div>
      <button class="filterButton" @click="toggleBalanceSort">Фильтр по балансу</button>
    </div>

    <div class="students-section">
      <div class="student-list-container">
        <div
          v-if="filteredStudents.length"
          v-for="student in filteredStudents"
          :key="student.id"
          :class="['student-card']"
          :style="{ backgroundColor: student.hex }"
        >
          <div class="row">
            <div class="column">
              <div class="user-style">
                {{ student.surname }} {{ student.name }} {{ student.patronymic }} (UTC{{
                  student.timezone
                }})
              </div>
              <div class="row contact">
                <div>{{ student.phone }}</div>
                <div class="email">{{ student.email }}</div>
              </div>
            </div>
            <div class="column student-grade">
              <div class="role-container">
                <div class="text-container">
                  <span class="grade-text">Класс: {{ student.grade }}</span>
                  <span class="balance-text">Баланс: {{ student.balance }}</span>
                </div>
                <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-students">Нет студентов</div>
      </div>
    </div>

    <ModalCreateClient
      :IsOpenModalCreateClient="isOpenModalCreateClient"
      @closeModalCreateClient="closeModalCreateClient"
      @addStudent="addStudent"
    />
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import ModalCreateClient from '@/components/ModalCreateClient.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'

const isOpenModalCreateClient = ref(false)
const StudentsStore = useStudentsStore()
const searchQuery = ref('')
const isSortedByBalance = ref(false);
const students = ref([])

const closeModalCreateClient = () => {
  isOpenModalCreateClient.value = false
}

const openModalCreateClient = () => {
  isOpenModalCreateClient.value = true
}

const updateStudents = () => {
  students.value = StudentsStore.students
}

const addStudent = (newStudent) => {
  StudentsStore.createStudent(newStudent)
  updateStudents()
}

const toggleBalanceSort = () => {
  isSortedByBalance.value = !isSortedByBalance.value;
};

const filteredStudents = computed(() => {
  let sortedStudents = students.value.filter(student =>
    `${student.surname} ${student.name} ${student.patronymic}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );

  if (isSortedByBalance.value) {
    return sortedStudents.sort((a, b) => a.balance - b.balance);
  }

  return sortedStudents;
});

watch(() => StudentsStore.students, updateStudents, { deep: true })

onMounted(updateStudents)
</script>

<style scoped>
.clients-top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #6e6565;
  padding-bottom: 8px;
}

.clients-top button {
  background-color: #b49db4;
  border-radius: 56px;
  padding: 8px 24px;
  font-size: 24px;
  align-items: center;
  gap: 8px;
}

.students-section {
  margin-top: 16px;
}

.plus-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding-top: 4px;
}

.student-card {
  margin-top: 24px;
  height: 131px;
  border-radius: 30px;
  padding: 17px 35px 27px;
}

.student-list-container {
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

.student-grade {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 360px;
}

.role-container {
  display: flex;
  align-items: center;
  gap: 220px;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.grade-text {
  font-size: 20px;
  font-weight: bold;
}

.balance-text {
  font-size: 18px;
  font-weight: bold;
}

.edit-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-self: center;
}

.no-students {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #888;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #b49db4;
  border-radius: 17px;
  padding: 5px;
  width: 350px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  outline: none;
  background-color: #f1f1f1;
  border-radius: 17px;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
.filterButton {
  background-color: #b49db4;
  border-radius: 56px;
  padding: 8px 24px;
  font-size: 24px;
  align-items: center;
  gap: 8px;
}
</style>
