<template>
  <ModalLayout :IsOpen="isOpenModalCreateLesson" @close="handleClose">
    <template #header>
      <span>Новая серия занятий</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Создать серию"
      :columns="2"
      @submit="createLessonSeries"
    >
      <template #after-fields>
        <div class="schedule-block">
          <div class="schedule-head">
            <div>
              <div class="schedule-title">Расписание по дням</div>
              <div class="schedule-subtitle">
                Для каждого дня недели можно указать своё время занятия
              </div>
            </div>
          </div>

          <div v-for="(row, index) in form.schedule" :key="index" class="schedule-row">
            <div class="schedule-field">
              <label :for="`weekday-${index}`" class="schedule-label">День недели</label>
              <select :id="`weekday-${index}`" v-model="row.weekday" class="schedule-control">
                <option value="">Выберите день</option>
                <option v-for="day in weekdayOptions" :key="day.value" :value="day.value">
                  {{ day.label }}
                </option>
              </select>
            </div>

            <div class="schedule-field">
              <label :for="`startTime-${index}`" class="schedule-label">Начало</label>
              <input
                :id="`startTime-${index}`"
                v-model="row.startTime"
                type="time"
                class="schedule-control"
              />
            </div>

            <div class="schedule-field">
              <label :for="`endTime-${index}`" class="schedule-label">Окончание</label>
              <input
                :id="`endTime-${index}`"
                v-model="row.endTime"
                type="time"
                class="schedule-control"
              />
            </div>

            <button
              v-if="form.schedule.length > 1"
              type="button"
              class="remove-row-btn"
              @click="removeScheduleRow(index)"
            >
              ×
            </button>
          </div>

          <button type="button" class="add-row-btn" @click="addScheduleRow">Добавить день</button>
        </div>
      </template>
    </UiFormBuilder>
  </ModalLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

import { useLessonsStore } from '@/stores/lessons'
import { useClientsStore } from '@/stores/clients'
import { useEmployersStore } from '@/stores/employers'
import { useFinancesStore } from '@/stores/finances'
import { useSubjectsStore } from '@/stores/subjects'

defineProps({
  isOpenModalCreateLesson: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['closeModalCreateLesson'])

const lessonsStore = useLessonsStore()
const clientsStore = useClientsStore()
const employersStore = useEmployersStore()
const financesStore = useFinancesStore()
const subjectsStore = useSubjectsStore()

const { clients } = storeToRefs(clientsStore)
const { employers } = storeToRefs(employersStore)
const { tariffs, teacherRates } = storeToRefs(financesStore)
const { subjects } = storeToRefs(subjectsStore)

const errors = ref({})
const formError = ref('')

const weekdayOptions = [
  { value: 1, label: 'Понедельник' },
  { value: 2, label: 'Вторник' },
  { value: 3, label: 'Среда' },
  { value: 4, label: 'Четверг' },
  { value: 5, label: 'Пятница' },
  { value: 6, label: 'Суббота' },
  { value: 7, label: 'Воскресенье' },
]

function createEmptyScheduleRow() {
  return {
    weekday: '',
    startTime: '',
    endTime: '',
  }
}

function createInitialForm() {
  return {
    teacherId: '',
    clientId: '',
    subject: '',
    startDate: '',
    endDate: '',
    schedule: [createEmptyScheduleRow()],
    tariffId: '',
    teacherRateId: '',
    status: 'active',
    organizationId: 0,
  }
}

const form = ref(createInitialForm())

const teacherOptions = computed(() => {
  return employers.value
    .filter((employer) => employer.role === 'teacher')
    .map((teacher) => ({
      value: teacher.id,
      label: `${teacher.surname} ${teacher.name} ${teacher.patronymic}`.trim(),
      subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
    }))
})

const clientOptions = computed(() => {
  return clients.value.map((client) => ({
    value: client.id,
    label: `${client.surname} ${client.name} ${client.patronymic}`.trim(),
  }))
})

const tariffOptions = computed(() =>
  tariffs.value.map((t) => ({
    value: t.id,
    label: `${t.title} — ${t.price} ₽`,
  })),
)

const teacherRateOptions = computed(() =>
  teacherRates.value.map((r) => {
    const subject = subjects.value.find((s) => s.id === r.subjectId)
    return {
      value: r.id,
      label: `${subject?.name ?? 'Предмет'} — ${r.lessonDurationMinutes} мин — ${r.rate} ₽`,
    }
  }),
)

const subjectOptions = computed(() => {
  if (form.value.teacherId) {
    const selectedTeacher = teacherOptions.value.find(
      (teacher) => Number(teacher.value) === Number(form.value.teacherId),
    )

    return (selectedTeacher?.subjects ?? []).map((subject) => ({
      value: subject,
      label: subject,
    }))
  }

  const allSubjects = employers.value
    .filter((employer) => employer.role === 'teacher')
    .flatMap((teacher) => (Array.isArray(teacher.subjects) ? teacher.subjects : []))

  return [...new Set(allSubjects)].map((subject) => ({
    value: subject,
    label: subject,
  }))
})

const fields = computed(() => [
  {
    name: 'teacherId',
    label: 'Преподаватель',
    type: 'select',
    placeholder: 'Выберите преподавателя',
    required: true,
    options: teacherOptions.value,
    fullWidth: true,
  },
  {
    name: 'clientId',
    label: 'Клиент',
    type: 'select',
    placeholder: 'Выберите клиента',
    required: true,
    options: clientOptions.value,
    fullWidth: true,
  },
  {
    name: 'subject',
    label: 'Предмет',
    type: 'select',
    placeholder: 'Выберите предмет',
    required: true,
    options: subjectOptions.value,
    fullWidth: true,
  },
  {
    name: 'tariffId',
    label: 'Тариф (для ученика)',
    type: 'select',
    placeholder: 'Выберите тариф',
    required: true,
    options: tariffOptions.value,
    fullWidth: true,
  },
  {
    name: 'teacherRateId',
    label: 'Ставка (для преподавателя)',
    type: 'select',
    placeholder: 'Выберите ставку',
    required: true,
    options: teacherRateOptions.value,
    fullWidth: true,
  },
  {
    name: 'startDate',
    label: 'Дата начала',
    type: 'date',
    required: true,
  },
  {
    name: 'endDate',
    label: 'Дата окончания',
    type: 'date',
    required: true,
  },
])

watch(
  () => form.value.teacherId,
  () => {
    const currentSubjectExists = subjectOptions.value.some(
      (option) => option.value === form.value.subject,
    )

    if (!currentSubjectExists) {
      form.value.subject = ''
    }
  },
)

function resetState() {
  form.value = createInitialForm()
  errors.value = {}
  formError.value = ''
}

function handleClose() {
  resetState()
  emit('closeModalCreateLesson')
}

function addScheduleRow() {
  form.value.schedule.push(createEmptyScheduleRow())
}

function removeScheduleRow(index) {
  if (form.value.schedule.length === 1) return
  form.value.schedule.splice(index, 1)
}

function validateForm() {
  errors.value = {}
  formError.value = ''

  if (!form.value.teacherId) {
    errors.value.teacherId = 'Выберите преподавателя'
  }

  if (!form.value.clientId) {
    errors.value.clientId = 'Выберите клиента'
  }

  if (!form.value.subject) {
    errors.value.subject = 'Выберите предмет'
  }

  if (!form.value.startDate) {
    errors.value.startDate = 'Укажите дату начала'
  }

  if (!form.value.endDate) {
    errors.value.endDate = 'Укажите дату окончания'
  }

  if (!form.value.tariffId) {
    errors.value.tariffId = 'Выберите тариф'
  }

  if (!form.value.teacherRateId) {
    errors.value.teacherRateId = 'Выберите ставку'
  }

  if (Object.keys(errors.value).length > 0) {
    return false
  }

  const startDate = new Date(`${form.value.startDate}T00:00:00`)
  const endDate = new Date(`${form.value.endDate}T00:00:00`)

  if (endDate < startDate) {
    formError.value = 'Дата окончания не может быть раньше даты начала'
    return false
  }

  const usedWeekdays = new Set()

  for (const row of form.value.schedule) {
    if (!row.weekday || !row.startTime || !row.endTime) {
      formError.value = 'Заполните все строки расписания'
      return false
    }

    if (usedWeekdays.has(Number(row.weekday))) {
      formError.value = 'Нельзя добавлять один и тот же день недели дважды'
      return false
    }

    usedWeekdays.add(Number(row.weekday))

    const startAt = new Date(`${form.value.startDate}T${row.startTime}:00`)
    const endAt = new Date(`${form.value.startDate}T${row.endTime}:00`)

    if (endAt <= startAt) {
      formError.value = 'Время окончания должно быть позже времени начала'
      return false
    }
  }

  return true
}

function createLessonSeries() {
  if (!validateForm()) {
    return
  }

  lessonsStore.createLessonSeries({
    teacherId: Number(form.value.teacherId),
    clientId: Number(form.value.clientId),
    subject: form.value.subject,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    schedule: form.value.schedule.map((row) => ({
      weekday: Number(row.weekday),
      startTime: row.startTime,
      endTime: row.endTime,
    })),
    tariffId: Number(form.value.tariffId),
    teacherRateId: Number(form.value.teacherRateId),
    status: 'active',
    organizationId: form.value.organizationId,
  })

  handleClose()
}
</script>

<style scoped>
.schedule-block {
  grid-column: 1 / -1;
  margin-top: 2px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background-color: var(--color-surface-muted);
}

.schedule-head {
  margin-bottom: 14px;
}

.schedule-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
}

.schedule-subtitle {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.schedule-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 44px;
  gap: 12px;
  align-items: end;
}

.schedule-row + .schedule-row {
  margin-top: 14px;
}

.schedule-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

.schedule-control {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.schedule-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.add-row-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 16px;
  border-radius: 14px;
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.add-row-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.remove-row-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  align-self: end;
  background-color: #f44336;
  color: #ffffff;
  font-size: 22px;
  line-height: 1;
  transition:
    transform var(--transition-base),
    opacity var(--transition-base);
}

.remove-row-btn:hover {
  transform: translateY(-1px);
}
</style>
