<template>
  <PageLayout>
    <div class="top-bar">
      <input type="text" v-model="searchQuery" placeholder="ФИО преподавателя или ученика" class="search-input" />
      <button class="add-lesson-btn" @click="openModalCreateLesson">+ Занятие</button>
    </div>

    <div class="schedule-nav">
      <div class="tabs">
        <span :class="{ active: activeTab === 'schedule' }" @click="setTab('schedule')">Расписание</span>
        <span :class="{ active: activeTab === 'freeTime' }" @click="setTab('freeTime')">Свободное время</span>
        <span :class="{ active: activeTab === 'offHours' }" @click="setTab('offHours')">Нерабочие часы</span>
      </div>

      <div class="date-picker">
        <button @click="prevWeek">‹</button>
        <span>{{ formattedWeekRange }}</span>
        <button @click="nextWeek">›</button>
      </div>
    </div>

    <div class="schedule">
      <table>
        <thead>
          <tr>
            <th>Время</th>
            <th v-for="date in weekDates" :key="date">{{ formatDate(date) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="time in timeSlots" :key="time">
            <td class="time-slot">{{ time }}</td>
            <td v-for="date in weekDates" :key="date" class="lesson-cell"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalCreateLesson :isOpen="isOpenModalCreateLesson" @close="closeModalCreateLesson" />
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import ModalCreateLesson from '@/components/ModalCreateLesson.vue'
import { ref, computed } from 'vue'

const isOpenModalCreateLesson = ref(false)
const searchQuery = ref('')
const activeTab = ref('schedule')
const selectedDate = ref(new Date().toISOString().split("T")[0])
const weekDates = ref([])
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

const openModalCreateLesson = () => {
  isOpenModalCreateLesson.value = true
}

const closeModalCreateLesson = () => {
  isOpenModalCreateLesson.value = false
}


const updateWeek = () => {
  const date = new Date(selectedDate.value)
  const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1))
  weekDates.value = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(d.getDate() + i)
    return d.toISOString().split("T")[0]
  })
}


const formattedWeekRange = computed(() => {
  const start = new Date(weekDates.value[0])
  const end = new Date(weekDates.value[6])
  return `${start.getDate()}.${start.getMonth() + 1}.${start.getFullYear()} - ${end.getDate()}.${end.getMonth() + 1}.${end.getFullYear()}`
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { weekday: 'short', day: '2-digit', month: '2-digit' })
}


const setTab = (tab) => {
  activeTab.value = tab
}

const prevWeek = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 7)
  selectedDate.value = date.toISOString().split("T")[0]
  updateWeek()
}

const nextWeek = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 7)
  selectedDate.value = date.toISOString().split("T")[0]
  updateWeek()
}

updateWeek()
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #6e6565;
}

.search-input {
  width: 520px;
  height: 48px;
  padding: 10px 15px;
  font-size: 24px;
  border: 1px solid #802e87;
  border-radius: 16px;
  outline: none;
  padding-right: 40px;
}


.add-lesson-btn {
  background-color: #b49db4;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 18px;
}

/* Навигация */
.schedule-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.tabs span {
  margin-right: 15px;
  cursor: pointer;
  font-size: 18px;
}

.tabs .active {
  font-weight: bold;
  color: #802e87;
}

.date-picker {
  display: flex;
  align-items: center;
}

.date-picker button {
  border: none;
  background: none;
  font-size: 36px;
  cursor: pointer;
  padding: 0 10px;
}

.timezone-info {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

/* Таблица */
.schedule {
  overflow-x: auto;
}

.schedule table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #802e87;
}

.schedule th, .schedule td {
  border: 1px solid #802e87;
  padding: 8px;
  text-align: center;
}

.schedule th {
  background: #f4f4f4;
  font-weight: bold;
}

.time-slot {
  background: #f4f4f4;
  font-weight: bold;
}

.lesson-cell {
  height: 40px;
}
</style>
