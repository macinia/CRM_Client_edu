<template>
  <PageLayout>
    <div class="top-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="ФИО преподавателя или ученика"
        class="search-input"
      />
      <button class="add-lesson-btn" @click="openModalCreateLesson">+ Занятие</button>
    </div>

    <div class="schedule-nav">
      <div class="tabs">
        <span :class="{ active: activeTab === 'schedule' }" @click="setTab('schedule')"
          >Расписание</span
        >
        <span :class="{ active: activeTab === 'freeTime' }" @click="setTab('freeTime')"
          >Свободное время</span
        >
        <span :class="{ active: activeTab === 'offHours' }" @click="setTab('offHours')"
          >Нерабочие часы</span
        >
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
            <td v-for="date in weekDates" :key="date" class="lesson-cell">
              <div
                v-for="{ lesson, duration, startOffset } in cellLessons[`${date}_${time}`] || []"
                :key="lesson.id"
                class="lesson-block"
                :style="{
                  height: `${(duration / 60) * 100}%`,
                  top: `${(startOffset / 60) * 100}%`,
                }"
              >
                {{ lesson.studentName }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalCreateLesson
      :isOpenModalCreateLesson="isOpenModalCreateLesson"
      @closeModalCreateLesson="closeModalCreateLesson"
    />
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import ModalCreateLesson from '@/components/ModalCreateLesson.vue'
import { ref, computed, watch } from 'vue'

const isOpenModalCreateLesson = ref(false)
const searchQuery = ref('')
const activeTab = ref('schedule')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const weekDates = ref([])
const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
]

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
    return d.toISOString().split('T')[0]
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
  selectedDate.value = date.toISOString().split('T')[0]
  updateWeek()
}

const nextWeek = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 7)
  selectedDate.value = date.toISOString().split('T')[0]
  updateWeek()
}

const lessons = ref([
  {
    studentName: 'alesha',
    teacherName: 'adnrey',
    start: '2025-04-11 09:00:00',
    end: '2025-04-11 10:00:00',
  },
  {
    studentName: 'alesha',
    teacherName: 'lesha',
    start: '2025-04-12 14:00:00',
    end: '2025-04-12 16:00:00',
  },
  {
    studentName: 'alesha',
    teacherName: 'maria',
    start: '2025-04-12 09:00:00',
    end: '2025-04-12 09:45:00',
  },
])
const cellLessons = ref({})

const filteredLessons = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return lessons.value.filter(
    (lesson) =>
      lesson.studentName.toLowerCase().includes(query) ||
      (lesson.teacherName && lesson.teacherName.toLowerCase().includes(query)),
  )
})

const updateCellLessons = () => {
  const newCellLessons = {}

  weekDates.value.forEach((date) => {
    timeSlots.forEach((time) => {
      const key = `${date}_${time}`
      const hourStart = new Date(`${date}T${time}:00`)
      const hourEnd = new Date(hourStart.getTime() + 3600000)

      const lessonsInCell = filteredLessons.value
        .map((lesson) => {
          const lessonStart = new Date(lesson.start)
          const lessonEnd = new Date(lesson.end)

          if (lessonStart >= hourEnd || lessonEnd <= hourStart) return null

          const start = new Date(Math.max(lessonStart, hourStart))
          const end = new Date(Math.min(lessonEnd, hourEnd))

          const startOffset = (start - hourStart) / (1000 * 60)
          const duration = (end - start) / (1000 * 60)

          return { lesson, duration, startOffset }
        })
        .filter(Boolean)

      newCellLessons[key] = lessonsInCell
    })
  })

  cellLessons.value = newCellLessons
}

watch([filteredLessons, weekDates], updateCellLessons)
watch(lessons, updateCellLessons)

updateCellLessons()

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

.schedule {
  overflow-x: auto;
}

.schedule table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #802e87;
}

.schedule th,
.schedule td {
  height: 50px;
  border: 1px solid #802e87;
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

.lesson-block {
  background-color: #b49db4;
  padding: 4px;
  font-size: 12px;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

.lesson-block:hover {
  opacity: 0.8;
}

.lesson-cell {
  vertical-align: top;
  min-width: 120px;
  min-height: 40px;
}
</style>
