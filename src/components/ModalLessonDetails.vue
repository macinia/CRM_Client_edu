<template>
  <ModalLayout :IsOpen="isOpen" @close="handleClose">
    <template #header>
      <span>Карточка занятия</span>
    </template>

    <div v-if="lesson" class="lesson-details">
      <div class="info-list">
        <div class="info-row">
          <span class="info-label">Ученик (-ца):</span>
          <span class="info-value">{{ clientName || 'Не указан' }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Класс:</span>
          <span class="info-value">
            {{ client?.grade ?? 'Не указан' }}
          </span>
        </div>

        <div class="info-row">
          <span class="info-label">Преподаватель:</span>
          <span class="info-value">{{ teacherName || 'Не указан' }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Предмет:</span>
          <span class="info-value">{{ lesson.subject || 'Не указан' }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">Посещение:</span>
          <select
            v-model="form.attendanceStatus"
            class="attendance-select"
            :class="attendanceClass"
          >
            <option value="not_selected">Не указано</option>
            <option value="present">Присутствовал</option>
            <option value="absent">Отсутствовал</option>
            <option value="excused">Уваж. причина</option>
          </select>
        </div>

        <div class="info-row">
          <span class="info-label">Ссылка на занятие:</span>
          <div class="link-block">
            <input
              v-model="form.meetingLink"
              type="text"
              class="detail-input"
              placeholder="Вставьте ссылку"
            />
            <a
              v-if="normalizedMeetingLink"
              :href="normalizedMeetingLink"
              target="_blank"
              rel="noopener noreferrer"
              class="meeting-link"
            >
              Открыть ссылку
            </a>
          </div>
        </div>

        <div class="info-row">
          <span class="info-label">Время занятия:</span>
          <span class="info-value">
            {{ formatDateTime(lesson.startAt) }} — {{ formatTime(lesson.endAt) }}
          </span>
        </div>

        <div class="comment-block">
          <label class="comment-label" for="lesson-comment">Комментарии:</label>
          <textarea
            id="lesson-comment"
            v-model="form.comment"
            class="comment-textarea"
            placeholder="Добавьте комментарий по занятию"
          />
        </div>
      </div>

      <button class="save-btn" @click="saveLesson">Сохранить</button>
    </div>

    <div v-else class="empty-state">Занятие не найдено</div>
  </ModalLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from '@/components/ModalLayout.vue'

import { useLessonsStore } from '@/stores/lessons'
import { useClientsStore } from '@/stores/clients'
import { useEmployersStore } from '@/stores/employers'
import { useFinancesStore } from '@/stores/finances'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  lessonId: {
    type: [Number, String, null],
    default: null,
  },
})

const emit = defineEmits(['close'])

const lessonsStore = useLessonsStore()
const clientsStore = useClientsStore()
const employersStore = useEmployersStore()
const financesStore = useFinancesStore()

const { clients } = storeToRefs(clientsStore)
const { employers } = storeToRefs(employersStore)

const form = ref(createInitialForm())

const lesson = computed(() => {
  if (!props.lessonId) return null
  return lessonsStore.getLessonById(Number(props.lessonId))
})

const client = computed(() => {
  if (!lesson.value) return null
  return clients.value.find((item) => item.id === lesson.value.clientId) || null
})

const teacher = computed(() => {
  if (!lesson.value) return null
  return employers.value.find((item) => item.id === lesson.value.teacherId) || null
})

const clientName = computed(() => {
  return getFullName(client.value)
})

const teacherName = computed(() => {
  return getFullName(teacher.value)
})

const attendanceClass = computed(() => {
  if (form.value.attendanceStatus === 'present') return 'attendance-present'
  if (form.value.attendanceStatus === 'absent') return 'attendance-absent'
  if (form.value.attendanceStatus === 'excused') return 'attendance-excused'
  return ''
})

const normalizedMeetingLink = computed(() => {
  const value = form.value.meetingLink.trim()

  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value

  return `https://${value}`
})

watch(
  () => [props.isOpen, lesson.value],
  ([isOpen]) => {
    if (!isOpen || !lesson.value) {
      resetForm()
      return
    }

    form.value = {
      attendanceStatus: lesson.value.attendanceStatus || 'not_selected',
      meetingLink: lesson.value.meetingLink || '',
      comment: lesson.value.comment || '',
    }
  },
  { immediate: true },
)

function createInitialForm() {
  return {
    attendanceStatus: 'not_selected',
    meetingLink: '',
    comment: '',
  }
}

function resetForm() {
  form.value = createInitialForm()
}

function getFullName(person) {
  if (!person) return ''
  return [person.surname, person.name, person.patronymic].filter(Boolean).join(' ')
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

function formatTime(dateTimeStr) {
  return new Date(dateTimeStr).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function saveLesson() {
  if (!lesson.value) return

  const previousAttendance = lesson.value.attendanceStatus
  const newAttendance = form.value.attendanceStatus

  if (previousAttendance !== newAttendance && client.value) {
    const tariff = lesson.value.tariffId
      ? financesStore.tariffs.find((t) => t.id === lesson.value.tariffId)
      : null

    if (tariff && tariff.lessonsCount > 0) {
      const pricePerLesson = tariff.price / tariff.lessonsCount
      const currentBalance = client.value.balance ?? 0

      if (newAttendance === 'present') {
        clientsStore.updateClient({ id: client.value.id, balance: currentBalance - pricePerLesson })
      } else if (previousAttendance === 'present') {
        clientsStore.updateClient({ id: client.value.id, balance: currentBalance + pricePerLesson })
      }
    }
  }

  lessonsStore.updateLesson({
    id: lesson.value.id,
    attendanceStatus: form.value.attendanceStatus,
    meetingLink: form.value.meetingLink.trim(),
    comment: form.value.comment.trim(),
  })

  emit('close')
}

function handleClose() {
  resetForm()
  emit('close')
}
</script>

<style scoped>
.lesson-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.info-label {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text);
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  word-break: break-word;
}

.link-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-input {
  width: 100%;
  min-height: 46px;
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

.detail-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.attendance-select {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 700;
}

.attendance-present {
  background-color: #5cff4d;
  color: #111111;
}

.attendance-absent {
  background-color: #ff4a4a;
  color: #ffffff;
}

.attendance-excused {
  background-color: #52d7ff;
  color: #111111;
}

.meeting-link {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
}

.comment-block {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-label {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text);
}

.comment-textarea {
  width: 100%;
  min-height: 140px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  resize: vertical;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.comment-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.save-btn {
  width: 100%;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.save-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.empty-state {
  padding: 32px 0;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-muted);
}
</style>
