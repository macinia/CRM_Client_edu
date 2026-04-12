<template>
  <PageLayout>
    <UiPageHeader
      title="Занятия"
      :action-visible="canManageLessons"
      action-label="Занятие"
      @action="openModalCreateLesson"
    />

    <div class="toolbar">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ФИО преподавателя или клиента"
          class="search-input"
        />
        <img src="@/assets/search.svg" alt="search" class="search-icon" />
      </div>

      <div class="week-controls">
        <button class="week-btn" @click="prevWeek">‹</button>
        <div class="week-range">{{ formattedWeekRange }}</div>
        <button class="week-btn" @click="nextWeek">›</button>
        <button class="current-week-btn" @click="goToCurrentWeek">Текущая неделя</button>
      </div>
    </div>

    <UiTabs v-model="activeTab" :items="tabItems" />

    <UiCardShell class="schedule-shell" padding="0" radius="24px">
      <template v-if="activeTab === 'schedule'">
        <div class="schedule-header">
          <div class="schedule-title-block">
            <h2 class="schedule-title">Расписание недели</h2>
            <p class="schedule-subtitle">Отображаются занятия выбранной недели с учетом поиска</p>
          </div>

          <div class="schedule-summary">
            <span class="summary-chip">Занятий: {{ visibleWeekLessons.length }}</span>
          </div>
        </div>

        <div class="schedule-table-wrap">
          <table class="schedule-table">
            <thead>
              <tr>
                <th class="time-head">Время</th>
                <th v-for="date in weekDates" :key="date" class="day-head">
                  {{ formatDate(date) }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="time in timeSlots" :key="time">
                <td class="time-slot">{{ time }}</td>

                <td v-for="date in weekDates" :key="`${date}_${time}`" class="lesson-cell">
                  <div
                    v-for="{ lesson, totalDuration, startOffset } in startCellLessons[
                      `${date}_${time}`
                    ] || []"
                    :key="lesson.id"
                    class="lesson-block"
                    :class="lesson.status"
                    :style="{
                      height: `${(totalDuration / 60) * 100}%`,
                      top: `${(startOffset / 60) * 100}%`,
                    }"
                  >
                    <span class="lesson-subject">{{ lesson.subject }}</span>
                    <span class="lesson-title">{{ lesson.clientName }}</span>
                    <span class="lesson-teacher">{{ lesson.teacherName }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else-if="activeTab === 'freeTime'">
        <div class="placeholder-card">
          <div class="placeholder-title">Свободное время</div>
          <div class="placeholder-text">
            Раздел свободного времени лучше вынести отдельно после завершения рефактора сущностей
            расписания.
          </div>
        </div>
      </template>

      <template v-else>
        <div class="placeholder-card">
          <div class="placeholder-title">Нерабочие часы</div>
          <div class="placeholder-text">
            Раздел нерабочих часов лучше вынести отдельно после завершения рефактора сущностей
            расписания.
          </div>
        </div>
      </template>
    </UiCardShell>

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

import UiPageHeader from '@/components/ui/UiPageHeader.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiCardShell from '@/components/ui/UiCardShell.vue'

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

const tabItems = computed(() => [
  { value: 'schedule', label: 'Расписание' },
  { value: 'freeTime', label: 'Свободное время' },
  { value: 'offHours', label: 'Нерабочие часы' },
])

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

  return `${formatDateRangePoint(start)} — ${formatDateRangePoint(end)}`
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

const startCellLessons = computed(() => {
  const result = {}

  weekDates.value.forEach((date) => {
    timeSlots.forEach((time) => {
      result[`${date}_${time}`] = []
    })
  })

  visibleWeekLessons.value.forEach((lesson) => {
    const lessonStart = new Date(lesson.startAt)
    const lessonEnd = new Date(lesson.endAt)

    const dateKey = toDateKey(lessonStart)
    const hourKey = `${String(lessonStart.getHours()).padStart(2, '0')}:00`

    if (!weekDates.value.includes(dateKey) || !timeSlots.includes(hourKey)) {
      return
    }

    const hourStart = new Date(`${dateKey}T${hourKey}:00`)
    const startOffset = (lessonStart.getTime() - hourStart.getTime()) / (1000 * 60)
    const totalDuration = Math.max(15, (lessonEnd.getTime() - lessonStart.getTime()) / (1000 * 60))

    result[`${dateKey}_${hourKey}`].push({
      lesson,
      totalDuration,
      startOffset,
    })
  })

  Object.keys(result).forEach((key) => {
    result[key].sort((a, b) => {
      const aStart = new Date(a.lesson.startAt).getTime()
      const bStart = new Date(b.lesson.startAt).getTime()
      return aStart - bStart
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

function goToCurrentWeek() {
  currentWeekDate.value = new Date()
}

function openModalCreateLesson() {
  isOpenModalCreateLesson.value = true
}

function closeModalCreateLesson() {
  isOpenModalCreateLesson.value = false
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 460px;
}

.search-input {
  width: 100%;
  min-height: 48px;
  padding: 0 44px 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  opacity: 0.65;
  pointer-events: none;
}

.week-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.week-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: 24px;
  line-height: 1;
  color: var(--color-text);
  transition:
    border-color var(--transition-base),
    color var(--transition-base),
    background-color var(--transition-base);
}

.week-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.week-range {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  background-color: var(--color-surface-muted);
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
}

.current-week-btn {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.current-week-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.schedule-shell {
  overflow: hidden;
}

.schedule-header {
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
}

.schedule-title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.schedule-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
}

.schedule-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.schedule-summary {
  display: flex;
  align-items: center;
}

.summary-chip {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
}

.schedule-table-wrap {
  overflow: auto;
  max-height: 550px;
}

.schedule-table {
  width: 100%;
  min-width: 980px;
  border-collapse: separate;
  border-spacing: 0;
}

.schedule-table thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #faf8fb;
}

.time-head,
.day-head {
  height: 56px;
  padding: 12px 10px;
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
}

.time-head {
  left: 0;
  z-index: 4;
  min-width: 92px;
}

.time-slot {
  position: sticky;
  left: 0;
  z-index: 2;
  width: 92px;
  min-width: 92px;
  background-color: #faf8fb;
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  text-align: center;
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text-muted);
}

.lesson-cell {
  position: relative;
  min-width: 140px;
  height: 88px;
  padding: 0;
  vertical-align: top;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  overflow: visible;
}

.lesson-block {
  position: absolute;
  left: 6px;
  right: 6px;
  z-index: 5;
  min-height: 24px;
  border-radius: 14px;
  padding: 8px 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: var(--shadow-sm);
  background: linear-gradient(135deg, #b991bc 0%, #8e4693 100%);
  color: #ffffff;
}

.lesson-block.completed {
  background: linear-gradient(135deg, #72a56e 0%, #4d8d59 100%);
}

.lesson-block.cancelled {
  background: linear-gradient(135deg, #cf8c8c 0%, #bb5b5b 100%);
}

.lesson-subject {
  font-size: 10px;
  font-weight: 800;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lesson-title {
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-teacher {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.92;
}

.placeholder-card {
  min-height: 240px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.placeholder-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text);
}

.placeholder-text {
  max-width: 700px;
  margin: 0 auto;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
}
</style>
