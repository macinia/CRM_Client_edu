<template>
  <PageLayout>
    <div class="top-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ФИО преподавателя или клиента"
        class="search-input"
      />

      <button v-if="canManageLessons" class="add-lesson-btn" @click="openModalCreateLesson">
        + Занятие
      </button>
    </div>

    <div class="schedule-nav">
      <div class="tabs">
        <span :class="{ active: activeTab === 'schedule' }" @click="setTab('schedule')">
          Расписание
        </span>
        <span :class="{ active: activeTab === 'freeTime' }" @click="setTab('freeTime')">
          Свободное время
        </span>
        <span :class="{ active: activeTab === 'offHours' }" @click="setTab('offHours')">
          Нерабочие часы
        </span>
      </div>

      <div class="date-picker">
        <button @click="prevWeek">‹</button>
        <span>{{ formattedWeekRange }}</span>
        <button @click="nextWeek">›</button>
      </div>
    </div>

    <div v-if="activeTab === 'schedule'" class="schedule">
      <table>
        <thead>
          <tr>
            <th>Время</th>
            <th v-for="date in weekDates" :key="date">
              {{ formatDate(date) }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="time in timeSlots" :key="time">
            <td class="time-slot">{{ time }}</td>

            <td v-for="date in weekDates" :key="`${date}_${time}`" class="lesson-cell">
              <div
                v-for="{ lesson, duration, startOffset } in cellLessons[`${date}_${time}`] || []"
                :key="lesson.id"
                class="lesson-block"
                :style="{
                  height: `${(duration / 60) * 100}%`,
                  top: `${(startOffset / 60) * 100}%`,
                }"
              >
                <span class="lesson-title">{{ lesson.clientName }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="activeTab === 'freeTime'" class="tab-placeholder">
      Раздел свободного времени вынесем отдельно после рефактора сущностей расписания.
    </div>

    <div v-else class="tab-placeholder">
      Раздел нерабочих часов вынесем отдельно после рефактора сущностей расписания.
    </div>

    <ModalCreateLesson
      :isOpenModalCreateLesson="isOpenModalCreateLesson"
      @closeModalCreateLesson="closeModalCreateLesson"
    />
  </PageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'
import ModalCreateLesson from '@/components/ModalCreateLesson.vue'

import { useAuthStore } from '@/stores/auth'
import { useLessonsStore } from '@/stores/lessons'
import { useClientsStore } from '@/stores/clients'
import { useEmployersStore } from '@/stores/employers'

const authStore = useAuthStore()
const lessonsStore = useLessonsStore()
const clientsStore = useClientsStore()
const employersStore = useEmployersStore()

const { lessons } = storeToRefs(lessonsStore)
const { clients } = storeToRefs(clientsStore)
const { employers } = storeToRefs(employersStore)

const isOpenModalCreateLesson = ref(false)
const searchQuery = ref('')
const activeTab = ref('schedule')
const currentWeekDate = ref(new Date())

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

const canManageLessons = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager'
})

const teachersMap = computed(() => {
  return employers.value.reduce((acc, employer) => {
    acc[employer.id] = employer
    return acc
  }, {})
})

const clientsMap = computed(() => {
  return clients.value.reduce((acc, client) => {
    acc[client.id] = client
    return acc
  }, {})
})

const weekStartDate = computed(() => {
  const date = new Date(currentWeekDate.value)
  date.setHours(0, 0, 0, 0)

  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day

  date.setDate(date.getDate() + diff)
  return date
})

const weekDates = computed(() => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStartDate.value)
    date.setDate(date.getDate() + index)
    return toDateKey(date)
  })
})

const formattedWeekRange = computed(() => {
  const start = new Date(weekStartDate.value)
  const end = new Date(weekStartDate.value)
  end.setDate(end.getDate() + 6)

  return `${formatDateRangePoint(start)} - ${formatDateRangePoint(end)}`
})

const enrichedLessons = computed(() => {
  return lessons.value.map((lesson) => {
    const teacher = teachersMap.value[lesson.teacherId] || null
    const client = clientsMap.value[lesson.clientId] || null

    return {
      ...lesson,
      teacher,
      client,
      teacherName: teacher ? getPersonFullName(teacher) : '',
      clientName: client ? getPersonFullName(client) : '',
    }
  })
})

const filteredLessons = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return enrichedLessons.value
  }

  return enrichedLessons.value.filter((lesson) => {
    return (
      lesson.teacherName.toLowerCase().includes(query) ||
      lesson.clientName.toLowerCase().includes(query)
    )
  })
})

const visibleWeekLessons = computed(() => {
  const weekStart = new Date(`${weekDates.value[0]}T00:00:00`)
  const weekEnd = new Date(`${weekDates.value[6]}T23:59:59`)

  return filteredLessons.value.filter((lesson) => {
    const lessonStart = new Date(lesson.startAt)
    const lessonEnd = new Date(lesson.endAt)

    return lessonStart <= weekEnd && lessonEnd >= weekStart
  })
})

const cellLessons = computed(() => {
  const result = {}

  weekDates.value.forEach((date) => {
    timeSlots.forEach((time) => {
      const key = `${date}_${time}`
      const hourStart = new Date(`${date}T${time}:00`)
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const lessonsInCell = visibleWeekLessons.value
        .map((lesson) => {
          const lessonStart = new Date(lesson.startAt)
          const lessonEnd = new Date(lesson.endAt)

          if (lessonStart >= hourEnd || lessonEnd <= hourStart) {
            return null
          }

          const start = new Date(Math.max(lessonStart.getTime(), hourStart.getTime()))
          const end = new Date(Math.min(lessonEnd.getTime(), hourEnd.getTime()))

          const startOffset = (start.getTime() - hourStart.getTime()) / (1000 * 60)
          const duration = (end.getTime() - start.getTime()) / (1000 * 60)

          return {
            lesson,
            duration,
            startOffset,
          }
        })
        .filter(Boolean)

      result[key] = lessonsInCell
    })
  })

  return result
})

function getPersonFullName(person) {
  return [person.surname, person.name, person.patronymic].filter(Boolean).join(' ')
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)

  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
}

function formatDateRangePoint(date) {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}

function setTab(tab) {
  activeTab.value = tab
}

function prevWeek() {
  const date = new Date(currentWeekDate.value)
  date.setDate(date.getDate() - 7)
  currentWeekDate.value = date
}

function nextWeek() {
  const date = new Date(currentWeekDate.value)
  date.setDate(date.getDate() + 7)
  currentWeekDate.value = date
}

function openModalCreateLesson() {
  isOpenModalCreateLesson.value = true
}

function closeModalCreateLesson() {
  isOpenModalCreateLesson.value = false
}
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
  border: 1px solid #802e87;
  text-align: center;
}

.schedule th {
  height: 50px;
  background: #f4f4f4;
  font-weight: bold;
}

.time-slot {
  width: 100px;
  background: #f4f4f4;
  font-weight: bold;
}

.lesson-cell {
  position: relative;
  vertical-align: top;
  min-width: 120px;
  height: 72px;
  padding: 0;
}

.lesson-block {
  position: absolute;
  left: 4px;
  right: 4px;
  background-color: #b49db4;
  border-radius: 10px;
  padding: 4px;
  font-size: 12px;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
  overflow: hidden;
}

.lesson-block:hover {
  opacity: 0.8;
}

.lesson-title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-placeholder {
  margin-top: 24px;
  padding: 24px;
  border: 1px dashed #802e87;
  border-radius: 20px;
  font-size: 18px;
  color: #5f4d60;
}
</style>
