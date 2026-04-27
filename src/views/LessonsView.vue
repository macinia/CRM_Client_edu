<template>
  <PageLayout>
    <UiPageHeader
      title="Занятия"
      :action-visible="activeTab === 'schedule' && canManageLessons"
      action-label="Серия занятий"
      @action="openModalCreateLesson"
    />

    <UiTabs v-model="activeTab" :items="tabItems" />

    <template v-if="activeTab === 'schedule'">
      <UiCardShell class="section-shell">
        <div class="section-toolbar">
          <div class="field-group teacher-select-group">
            <label class="field-label" for="schedule-teacher">Преподаватель</label>
            <select id="schedule-teacher" v-model="selectedScheduleTeacherId" class="page-control">
              <option value="">Выберите преподавателя</option>
              <option v-for="teacher in teacherOptions" :key="teacher.value" :value="teacher.value">
                {{ teacher.label }}
              </option>
            </select>
          </div>

          <div v-if="selectedScheduleTeacherId" class="week-controls">
            <button class="week-btn" @click="prevWeek">‹</button>
            <div class="week-range">{{ formattedWeekRange }}</div>
            <button class="week-btn" @click="nextWeek">›</button>
            <button class="current-week-btn" @click="goToCurrentWeek">Текущая неделя</button>
          </div>
        </div>

        <div v-if="!selectedScheduleTeacherId" class="empty-state">
          <div class="empty-state-title">Выберите преподавателя</div>
          <div class="empty-state-text">
            После выбора преподавателя здесь появится его расписание на неделю.
          </div>
        </div>

        <template v-else>
          <div class="schedule-header">
            <div class="schedule-title-block">
              <h2 class="schedule-title">
                {{ getPersonFullName(scheduleTeacher) || 'Расписание преподавателя' }}
              </h2>
              <p class="schedule-subtitle">
                UTC{{ scheduleTeacher?.timezone || '+0' }} · занятий на неделе:
                {{ visibleWeekLessons.length }}
              </p>
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
                      @click="openLessonDetails(lesson)"
                    >
                      <span class="lesson-subject">{{ lesson.subject }}</span>
                      <span class="lesson-title">{{ lesson.clientName }}</span>
                      <span class="lesson-time">
                        {{ formatTime(lesson.startAt) }}–{{ formatTime(lesson.endAt) }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </UiCardShell>
    </template>

    <template v-else-if="activeTab === 'freeTime'">
      <UiCardShell class="section-shell">
        <div class="filters-header">
          <div>
            <h2 class="section-title">Свободное время преподавателей</h2>
            <p class="section-subtitle">
              Подбор свободных преподавателей по диапазону, предмету, классу и времени.
            </p>
          </div>
        </div>

        <div class="filters-grid">
          <div class="field-group">
            <label class="field-label" for="free-range-start">Дата начала</label>
            <input
              id="free-range-start"
              v-model="freeTimeForm.rangeStart"
              type="date"
              class="page-control"
              lang="ru-RU"
            />
          </div>

          <div class="field-group">
            <label class="field-label" for="free-range-end">Дата окончания</label>
            <input
              id="free-range-end"
              v-model="freeTimeForm.rangeEnd"
              type="date"
              class="page-control"
              lang="ru-RU"
            />
          </div>

          <div class="field-group">
            <label class="field-label" for="free-subject">Предмет</label>
            <select id="free-subject" v-model="freeTimeForm.subject" class="page-control">
              <option value="">Любой предмет</option>
              <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label" for="free-grade">Класс</label>
            <select id="free-grade" v-model="freeTimeForm.grade" class="page-control">
              <option value="">Любой класс</option>
              <option v-for="grade in gradeOptions" :key="grade" :value="String(grade)">
                {{ grade }} класс
              </option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label" for="free-start-time">Начало</label>
            <input
              id="free-start-time"
              v-model="freeTimeForm.startTime"
              type="time"
              class="page-control"
              lang="ru-RU"
              step="60"
            />
          </div>

          <div class="field-group">
            <label class="field-label" for="free-end-time">Окончание</label>
            <input
              id="free-end-time"
              v-model="freeTimeForm.endTime"
              type="time"
              class="page-control"
              lang="ru-RU"
              step="60"
            />
          </div>
        </div>

        <div class="filters-actions">
          <div v-if="freeTimeFormError" class="form-error">
            {{ freeTimeFormError }}
          </div>

          <button class="primary-btn" @click="applyFreeTimeFilters">Найти</button>
        </div>
      </UiCardShell>

      <UiCardList
        :is-empty="freeTimeResults.length === 0"
        :empty-text="freeTimeEmptyText"
        max-height="calc(100vh - 360px)"
      >
        <UiCardShell
          v-for="result in freeTimeResults"
          :key="result.teacher.id"
          :background-color="result.teacher.color"
          class="teacher-card"
        >
          <div class="teacher-main">
            <div class="teacher-head">
              <p class="teacher-name">
                {{ getPersonFullName(result.teacher) }}
              </p>
              <span class="teacher-timezone">UTC{{ result.teacher.timezone }}</span>
            </div>

            <div class="teacher-contacts">
              <span>{{ result.teacher.phone || 'Телефон не указан' }}</span>
              <span>{{ result.teacher.email || 'Email не указан' }}</span>
            </div>

            <div class="teacher-meta">
              <span>Предметы: {{ formatSubjects(result.teacher.subjects) }}</span>
              <span>Классы: {{ formatGrades(result.teacher.grades) }}</span>
            </div>
          </div>

          <div class="teacher-availability">
            <div class="availability-title">
              Подходит по фильтрам: {{ result.availableDates.length }} дн.
            </div>
            <div class="availability-dates">
              <span v-for="date in result.availableDates.slice(0, 6)" :key="date" class="date-chip">
                {{ formatShortDate(date) }}
              </span>

              <span v-if="result.availableDates.length > 6" class="date-chip date-chip--muted">
                +{{ result.availableDates.length - 6 }}
              </span>
            </div>
          </div>
        </UiCardShell>
      </UiCardList>
    </template>

    <template v-else>
      <UiCardShell class="section-shell">
        <div class="section-toolbar">
          <div class="field-group teacher-select-group">
            <label class="field-label" for="offhours-teacher">Преподаватель</label>
            <select id="offhours-teacher" v-model="selectedOffHoursTeacherId" class="page-control">
              <option value="">Выберите преподавателя</option>
              <option v-for="teacher in teacherOptions" :key="teacher.value" :value="teacher.value">
                {{ teacher.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="!selectedOffHoursTeacherId" class="empty-state">
          <div class="empty-state-title">Выберите преподавателя</div>
          <div class="empty-state-text">
            После выбора преподавателя здесь появятся его нерабочие часы.
          </div>
        </div>

        <template v-else>
          <div v-if="canManageOffHours" class="offhours-form-block">
            <div class="offhours-form-head">
              <div>
                <h2 class="section-title">
                  {{
                    isEditingOffHours
                      ? 'Редактирование нерабочего времени'
                      : 'Новое нерабочее время'
                  }}
                </h2>
                <p class="section-subtitle">
                  Только администратор может изменять интервалы недоступности преподавателя.
                </p>
              </div>
            </div>

            <div class="offhours-form-grid">
              <div class="field-group">
                <label class="field-label" for="offhours-start">Начало</label>
                <input
                  id="offhours-start"
                  v-model="offHoursForm.startAt"
                  type="datetime-local"
                  class="page-control"
                  lang="ru-RU"
                  step="60"
                />
              </div>

              <div class="field-group">
                <label class="field-label" for="offhours-end">Окончание</label>
                <input
                  id="offhours-end"
                  v-model="offHoursForm.endAt"
                  type="datetime-local"
                  class="page-control"
                  lang="ru-RU"
                  step="60"
                />
              </div>

              <div class="field-group field-group-full">
                <label class="field-label" for="offhours-reason">Причина</label>
                <input
                  id="offhours-reason"
                  v-model="offHoursForm.reason"
                  type="text"
                  class="page-control"
                  placeholder="Например: личное время, отпуск, методический день"
                />
              </div>
            </div>

            <div class="filters-actions">
              <div v-if="offHoursFormError" class="form-error">
                {{ offHoursFormError }}
              </div>

              <div class="inline-actions">
                <button class="primary-btn" @click="saveOffHours">
                  {{ isEditingOffHours ? 'Сохранить' : 'Добавить' }}
                </button>

                <button v-if="isEditingOffHours" class="secondary-btn" @click="resetOffHoursForm">
                  Отмена
                </button>
              </div>
            </div>
          </div>

          <UiCardList
            :is-empty="selectedTeacherOffHours.length === 0"
            empty-text="Нерабочие часы для этого преподавателя пока не заданы"
            max-height="calc(100vh - 470px)"
          >
            <UiCardShell
              v-for="item in selectedTeacherOffHours"
              :key="item.id"
              class="offhours-card"
            >
              <div class="offhours-main">
                <div class="offhours-range">
                  {{ formatDateTime(item.startAt) }} — {{ formatDateTime(item.endAt) }}
                </div>
                <div class="offhours-reason">
                  {{ item.reason || 'Причина не указана' }}
                </div>
              </div>

              <div v-if="canManageOffHours" class="offhours-actions">
                <button class="icon-btn" @click="startEditOffHours(item)">
                  <img src="@/assets/edit.svg" alt="edit" class="action-icon" />
                </button>

                <button class="icon-btn danger-btn" @click="removeOffHours(item.id)">×</button>
              </div>
            </UiCardShell>
          </UiCardList>
        </template>
      </UiCardShell>
    </template>

    <ModalCreateLesson
      :isOpenModalCreateLesson="isOpenModalCreateLesson"
      @closeModalCreateLesson="closeModalCreateLesson"
    />

    <ModalLessonDetails
      :isOpen="isOpenLessonDetails"
      :lessonId="selectedLessonId"
      @close="closeLessonDetails"
    />
  </PageLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'
import ModalCreateLesson from '@/components/ModalCreateLesson.vue'
import ModalLessonDetails from '@/components/ModalLessonDetails.vue'

import UiPageHeader from '@/components/ui/UiPageHeader.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiCardList from '@/components/ui/UiCardList.vue'
import UiCardShell from '@/components/ui/UiCardShell.vue'

import { useAuthStore } from '@/stores/auth'
import { useLessonsStore } from '@/stores/lessons'
import { useClientsStore } from '@/stores/clients'
import { useEmployersStore } from '@/stores/employers'

const authStore = useAuthStore()
const lessonsStore = useLessonsStore()
const clientsStore = useClientsStore()
const employersStore = useEmployersStore()

const { lessons, offHours } = storeToRefs(lessonsStore)
const { clients } = storeToRefs(clientsStore)
const { employers } = storeToRefs(employersStore)

const isOpenModalCreateLesson = ref(false)
const isOpenLessonDetails = ref(false)
const selectedLessonId = ref(null)

const activeTab = ref('schedule')
const currentWeekDate = ref(new Date())

const selectedScheduleTeacherId = ref('')
const selectedOffHoursTeacherId = ref('')

const freeTimeForm = ref({
  rangeStart: '',
  rangeEnd: '',
  subject: '',
  grade: '',
  startTime: '',
  endTime: '',
})

const appliedFreeTimeFilters = ref(null)
const freeTimeFormError = ref('')

const offHoursForm = ref(createEmptyOffHoursForm())
const offHoursFormError = ref('')

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

const canManageOffHours = computed(() => {
  return authStore.user?.role === 'admin'
})

const tabItems = computed(() => [
  { value: 'schedule', label: 'Расписание' },
  { value: 'freeTime', label: 'Свободное время' },
  { value: 'offHours', label: 'Нерабочие часы' },
])

const activeTeachers = computed(() => {
  return employers.value.filter((item) => item.role === 'teacher' && item.status === 'active')
})

const teacherOptions = computed(() => {
  return activeTeachers.value.map((teacher) => ({
    value: String(teacher.id),
    label: getPersonFullName(teacher),
  }))
})

const teachersMap = computed(() => {
  return activeTeachers.value.reduce((acc, teacher) => {
    acc[teacher.id] = teacher
    return acc
  }, {})
})

const clientsMap = computed(() => {
  return clients.value.reduce((acc, client) => {
    acc[client.id] = client
    return acc
  }, {})
})

const subjectOptions = computed(() => {
  return [...new Set(activeTeachers.value.flatMap((teacher) => teacher.subjects || []))].sort()
})

const gradeOptions = computed(() => {
  return [...new Set(activeTeachers.value.flatMap((teacher) => teacher.grades || []))].sort(
    (a, b) => a - b,
  )
})

const scheduleTeacher = computed(() => {
  return teachersMap.value[Number(selectedScheduleTeacherId.value)] || null
})

const offHoursTeacher = computed(() => {
  return teachersMap.value[Number(selectedOffHoursTeacherId.value)] || null
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

const scheduleLessons = computed(() => {
  if (!selectedScheduleTeacherId.value) return []

  return enrichedLessons.value.filter((lesson) => {
    return Number(lesson.teacherId) === Number(selectedScheduleTeacherId.value)
  })
})

const visibleWeekLessons = computed(() => {
  if (!selectedScheduleTeacherId.value) return []

  const weekStart = new Date(`${weekDates.value[0]}T00:00:00`)
  const weekEnd = new Date(`${weekDates.value[6]}T23:59:59`)

  return scheduleLessons.value.filter((lesson) => {
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

const freeTimeResults = computed(() => {
  if (!appliedFreeTimeFilters.value) return []

  const filters = appliedFreeTimeFilters.value
  const dateKeys = getDateKeysBetween(filters.rangeStart, filters.rangeEnd)

  return activeTeachers.value
    .filter((teacher) => {
      const subjectMatch = !filters.subject || (teacher.subjects || []).includes(filters.subject)
      const gradeMatch = !filters.grade || (teacher.grades || []).includes(Number(filters.grade))

      return subjectMatch && gradeMatch
    })
    .map((teacher) => {
      const availableDates = dateKeys.filter((dateKey) => {
        const startAt = `${dateKey}T${filters.startTime}:00`
        const endAt = `${dateKey}T${filters.endTime}:00`

        const hasLessonConflict = lessons.value.some((lesson) => {
          return (
            Number(lesson.teacherId) === Number(teacher.id) &&
            lesson.status !== 'cancelled' &&
            isIntervalsIntersect(lesson.startAt, lesson.endAt, startAt, endAt)
          )
        })

        if (hasLessonConflict) {
          return false
        }

        const hasOffHoursConflict = offHours.value.some((item) => {
          return (
            Number(item.teacherId) === Number(teacher.id) &&
            isIntervalsIntersect(item.startAt, item.endAt, startAt, endAt)
          )
        })

        return !hasOffHoursConflict
      })

      return {
        teacher,
        availableDates,
      }
    })
    .filter((item) => item.availableDates.length > 0)
    .sort((a, b) => {
      if (b.availableDates.length !== a.availableDates.length) {
        return b.availableDates.length - a.availableDates.length
      }

      return getPersonFullName(a.teacher).localeCompare(getPersonFullName(b.teacher), 'ru')
    })
})

const freeTimeEmptyText = computed(() => {
  if (!appliedFreeTimeFilters.value) {
    return 'Задайте параметры поиска и нажмите «Найти»'
  }

  return 'По заданным параметрам свободных преподавателей не найдено'
})

const selectedTeacherOffHours = computed(() => {
  if (!selectedOffHoursTeacherId.value) return []

  return [...offHours.value]
    .filter((item) => Number(item.teacherId) === Number(selectedOffHoursTeacherId.value))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
})

const isEditingOffHours = computed(() => {
  return Boolean(offHoursForm.value.id)
})

watch(selectedOffHoursTeacherId, () => {
  resetOffHoursForm()
})

function createEmptyOffHoursForm() {
  return {
    id: null,
    startAt: '',
    endAt: '',
    reason: '',
  }
}

function getPersonFullName(person) {
  if (!person) return ''
  return [person.surname, person.name, person.patronymic].filter(Boolean).join(' ')
}

function formatSubjects(subjects) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return 'Не указаны'
  }

  return subjects.join(', ')
}

function formatGrades(grades) {
  if (!Array.isArray(grades) || grades.length === 0) {
    return 'Не указаны'
  }

  return grades.join(', ')
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

function formatShortDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  })
}

function formatDateRangePoint(date) {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}

function formatTime(dateTimeStr) {
  return new Date(dateTimeStr).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateTime(dateTimeStr) {
  return new Date(dateTimeStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateTimeLocalValue(dateTimeStr) {
  if (!dateTimeStr) return ''

  const date = new Date(dateTimeStr)

  if (Number.isNaN(date.getTime())) {
    return String(dateTimeStr).slice(0, 16)
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function normalizeDateTimeForStore(value) {
  if (!value) return ''
  return value.length === 16 ? `${value}:00` : value
}

function isIntervalsIntersect(startA, endA, startB, endB) {
  const aStart = new Date(startA).getTime()
  const aEnd = new Date(endA).getTime()
  const bStart = new Date(startB).getTime()
  const bEnd = new Date(endB).getTime()

  return aStart < bEnd && aEnd > bStart
}

function getDateKeysBetween(startDateStr, endDateStr) {
  const dates = []
  const start = new Date(`${startDateStr}T00:00:00`)
  const end = new Date(`${endDateStr}T00:00:00`)
  const current = new Date(start)

  while (current <= end) {
    dates.push(toDateKey(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
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

function openLessonDetails(lesson) {
  selectedLessonId.value = lesson.id
  isOpenLessonDetails.value = true
}

function closeLessonDetails() {
  isOpenLessonDetails.value = false
  selectedLessonId.value = null
}


function applyFreeTimeFilters() {
  freeTimeFormError.value = ''

  if (!freeTimeForm.value.rangeStart || !freeTimeForm.value.rangeEnd) {
    freeTimeFormError.value = 'Укажите диапазон дат'
    return
  }

  if (!freeTimeForm.value.startTime || !freeTimeForm.value.endTime) {
    freeTimeFormError.value = 'Укажите время начала и окончания'
    return
  }

  const startDate = new Date(`${freeTimeForm.value.rangeStart}T00:00:00`)
  const endDate = new Date(`${freeTimeForm.value.rangeEnd}T00:00:00`)

  if (endDate < startDate) {
    freeTimeFormError.value = 'Дата окончания не может быть раньше даты начала'
    return
  }

  const startAt = new Date(`${freeTimeForm.value.rangeStart}T${freeTimeForm.value.startTime}:00`)
  const endAt = new Date(`${freeTimeForm.value.rangeStart}T${freeTimeForm.value.endTime}:00`)

  if (endAt <= startAt) {
    freeTimeFormError.value = 'Время окончания должно быть позже времени начала'
    return
  }

  appliedFreeTimeFilters.value = {
    rangeStart: freeTimeForm.value.rangeStart,
    rangeEnd: freeTimeForm.value.rangeEnd,
    subject: freeTimeForm.value.subject,
    grade: freeTimeForm.value.grade,
    startTime: freeTimeForm.value.startTime,
    endTime: freeTimeForm.value.endTime,
  }
}

function resetOffHoursForm() {
  offHoursForm.value = createEmptyOffHoursForm()
  offHoursFormError.value = ''
}

function startEditOffHours(item) {
  offHoursForm.value = {
    id: item.id,
    startAt: formatDateTimeLocalValue(item.startAt),
    endAt: formatDateTimeLocalValue(item.endAt),
    reason: item.reason || '',
  }

  offHoursFormError.value = ''
}

function saveOffHours() {
  offHoursFormError.value = ''

  if (!selectedOffHoursTeacherId.value) {
    offHoursFormError.value = 'Сначала выберите преподавателя'
    return
  }

  if (!offHoursForm.value.startAt || !offHoursForm.value.endAt) {
    offHoursFormError.value = 'Укажите начало и окончание интервала'
    return
  }

  const startAt = new Date(offHoursForm.value.startAt)
  const endAt = new Date(offHoursForm.value.endAt)

  if (endAt <= startAt) {
    offHoursFormError.value = 'Окончание должно быть позже начала'
    return
  }

  const payload = {
    id: offHoursForm.value.id,
    teacherId: Number(selectedOffHoursTeacherId.value),
    startAt: normalizeDateTimeForStore(offHoursForm.value.startAt),
    endAt: normalizeDateTimeForStore(offHoursForm.value.endAt),
    reason: offHoursForm.value.reason.trim(),
    organizationId: offHoursTeacher.value?.organizationId ?? 0,
  }

  if (offHoursForm.value.id) {
    lessonsStore.updateOffHours(payload)
  } else {
    lessonsStore.createOffHours(payload)
  }

  resetOffHoursForm()
}

function removeOffHours(id) {
  lessonsStore.deleteOffHours(id)

  if (offHoursForm.value.id === id) {
    resetOffHoursForm()
  }
}
</script>

<style scoped>
.section-shell {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 240px;
}

.section-toolbar,
.filters-header,
.schedule-header,
.offhours-form-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.teacher-select-group {
  max-width: 420px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group-full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

.page-control {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.page-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.section-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
}

.section-subtitle {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.empty-state {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.empty-state-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text);
}

.empty-state-text {
  max-width: 560px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.week-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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

.current-week-btn,
.primary-btn,
.secondary-btn {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    border-color var(--transition-base);
}

.current-week-btn,
.primary-btn {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
}

.current-week-btn:hover,
.primary-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.secondary-btn {
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
}

.secondary-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filters-grid,
.offhours-form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.filters-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.inline-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.form-error {
  font-size: 14px;
  font-weight: 700;
  color: #c04545;
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

.schedule-table-wrap {
  overflow: auto;
  max-height: 620px;
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
  cursor: pointer;
  transition: transform var(--transition-base);
}

.lesson-block:hover {
  transform: scale(1.01);
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

.lesson-time {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.92;
}

.teacher-card {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(240px, 1fr);
  align-items: center;
  gap: 20px;
  min-height: 124px;
}

.teacher-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.teacher-head {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.teacher-name {
  min-width: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-timezone {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 6px 10px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.45);
}

.teacher-contacts,
.teacher-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.teacher-availability {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text);
}

.availability-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.date-chip {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.52);
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

.date-chip--muted {
  opacity: 0.8;
}

.offhours-form-block {
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background-color: var(--color-surface-muted);
}

.offhours-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-height: 100px;
}

.offhours-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.offhours-range {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text);
}

.offhours-reason {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.offhours-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-muted);
  transition:
    background-color var(--transition-base),
    transform var(--transition-base);
}

.icon-btn:hover {
  background-color: rgba(128, 46, 135, 0.12);
  transform: translateY(-1px);
}

.danger-btn {
  font-size: 24px;
  line-height: 1;
  color: #b54b4b;
}

.action-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 1100px) {
  .filters-grid,
  .offhours-form-grid,
  .teacher-card {
    grid-template-columns: 1fr;
  }

  .section-toolbar,
  .filters-header,
  .schedule-header {
    flex-direction: column;
    align-items: stretch;
  }

  .teacher-select-group {
    max-width: none;
  }
}
</style>
