<template>
  <ModalLayout :IsOpen="isOpenModalCreateLesson" @close="$emit('closeModalCreateLesson')">
    <template #header>
      <span>Новая серия занятий</span>
    </template>

    <form class="lesson-form" @submit.prevent="createLessonSeries">
      <div class="Input-item">
        <label for="teacherId">Преподаватель</label>
        <select id="teacherId" v-model="form.teacherId" @change="handleTeacherChange" required>
          <option value="">Выберите преподавателя</option>
          <option v-for="teacher in teacherOptions" :key="teacher.id" :value="teacher.id">
            {{ teacher.label }}
          </option>
        </select>
      </div>

      <div class="Input-item">
        <label for="clientId">Клиент</label>
        <select id="clientId" v-model="form.clientId" required>
          <option value="">Выберите клиента</option>
          <option v-for="client in clientOptions" :key="client.id" :value="client.id">
            {{ client.label }}
          </option>
        </select>
      </div>

      <div class="Input-item">
        <label for="subject">Предмет</label>
        <select id="subject" v-model="form.subject" required>
          <option value="">Выберите предмет</option>
          <option v-for="subject in subjectOptions" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>

      <div class="date-row">
        <div class="Input-item">
          <label for="startDate">Дата начала</label>
          <input id="startDate" v-model="form.startDate" type="date" required />
        </div>

        <div class="Input-item">
          <label for="endDate">Дата окончания</label>
          <input id="endDate" v-model="form.endDate" type="date" required />
        </div>
      </div>

      <div class="schedule-block">
        <div class="schedule-title">Расписание по дням</div>

        <div v-for="(row, index) in form.schedule" :key="index" class="schedule-row">
          <div class="Input-item">
            <label :for="`weekday-${index}`">День недели</label>
            <select :id="`weekday-${index}`" v-model="row.weekday" required>
              <option value="">Выберите день</option>
              <option v-for="day in weekdayOptions" :key="day.value" :value="day.value">
                {{ day.label }}
              </option>
            </select>
          </div>

          <div class="Input-item">
            <label :for="`startTime-${index}`">Начало</label>
            <input :id="`startTime-${index}`" v-model="row.startTime" type="time" required />
          </div>

          <div class="Input-item">
            <label :for="`endTime-${index}`">Окончание</label>
            <input :id="`endTime-${index}`" v-model="row.endTime" type="time" required />
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

      <div class="form-actions">
        <button type="submit" class="submit-btn">Создать серию</button>
      </div>
    </form>
  </ModalLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ModalLayout from './ModalLayout.vue'
import { useLessonsStore } from '@/stores/lessons'
import { useClientsStore } from '@/stores/clients'
import { useEmployersStore } from '@/stores/employers'

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

const { clients } = storeToRefs(clientsStore)
const { employers } = storeToRefs(employersStore)

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
    status: 'active',
    organizationId: 0,
  }
}

const form = ref(createInitialForm())

const teacherOptions = computed(() => {
  return employers.value
    .filter((employer) => employer.role === 'teacher')
    .map((teacher) => ({
      id: teacher.id,
      label: `${teacher.surname} ${teacher.name} ${teacher.patronymic}`.trim(),
      subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
    }))
})

const clientOptions = computed(() => {
  return clients.value.map((client) => ({
    id: client.id,
    label: `${client.surname} ${client.name} ${client.patronymic}`.trim(),
  }))
})

const subjectOptions = computed(() => {
  if (form.value.teacherId) {
    const selectedTeacher = teacherOptions.value.find(
      (teacher) => Number(teacher.id) === Number(form.value.teacherId),
    )

    return selectedTeacher?.subjects ?? []
  }

  const allSubjects = employers.value
    .filter((employer) => employer.role === 'teacher')
    .flatMap((teacher) => (Array.isArray(teacher.subjects) ? teacher.subjects : []))

  return [...new Set(allSubjects)]
})

function handleTeacherChange() {
  if (!subjectOptions.value.includes(form.value.subject)) {
    form.value.subject = ''
  }
}

function addScheduleRow() {
  form.value.schedule.push(createEmptyScheduleRow())
}

function removeScheduleRow(index) {
  if (form.value.schedule.length === 1) return
  form.value.schedule.splice(index, 1)
}

function validateForm() {
  if (
    !form.value.teacherId ||
    !form.value.clientId ||
    !form.value.subject ||
    !form.value.startDate ||
    !form.value.endDate
  ) {
    alert('Заполните обязательные поля')
    return false
  }

  const startDate = new Date(`${form.value.startDate}T00:00:00`)
  const endDate = new Date(`${form.value.endDate}T00:00:00`)

  if (endDate < startDate) {
    alert('Дата окончания не может быть раньше даты начала')
    return false
  }

  const usedWeekdays = new Set()

  for (const row of form.value.schedule) {
    if (!row.weekday || !row.startTime || !row.endTime) {
      alert('Заполните все строки расписания')
      return false
    }

    if (usedWeekdays.has(Number(row.weekday))) {
      alert('Нельзя добавлять один и тот же день недели дважды')
      return false
    }

    usedWeekdays.add(Number(row.weekday))

    const startAt = new Date(`${form.value.startDate}T${row.startTime}:00`)
    const endAt = new Date(`${form.value.startDate}T${row.endTime}:00`)

    if (endAt <= startAt) {
      alert('Время окончания должно быть позже времени начала')
      return false
    }
  }

  return true
}

function createLessonSeries() {
  if (!validateForm()) return

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
    status: 'active',
    organizationId: form.value.organizationId,
  })

  form.value = createInitialForm()
  emit('closeModalCreateLesson')
}
</script>

<style scoped>
.lesson-form {
  display: flex;
  flex-direction: column;
}

.Input-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.Input-item label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.Input-item input,
.Input-item select {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 2px solid #802e87;
  border-radius: 17px;
  background-color: #f5f5f5;
  outline: none;
}

.Input-item input:focus,
.Input-item select:focus {
  border-color: #5d1e5e;
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.1);
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.schedule-block {
  margin-bottom: 16px;
  padding: 16px;
  border: 2px solid #802e87;
  border-radius: 17px;
  background-color: #f9f9f9;
}

.schedule-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.schedule-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 48px;
  gap: 12px;
  align-items: end;
  margin-bottom: 12px;
}

.add-row-btn,
.remove-row-btn {
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.add-row-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background-color: #802e87;
}

.add-row-btn:hover {
  background-color: #5d1e5e;
}

.remove-row-btn {
  width: 48px;
  height: 44px;
  font-size: 22px;
  color: white;
  background-color: #f44336;
}

.remove-row-btn:hover {
  background-color: #da190b;
}

.form-actions {
  margin-top: 8px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background-color: #802e87;
  border: none;
  border-radius: 17px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #5d1e5e;
}
</style>
