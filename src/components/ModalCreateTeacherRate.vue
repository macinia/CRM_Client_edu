<template>
  <ModalLayout :IsOpen="isOpenModalCreateTeacherRate" @close="handleClose">
    <template #header>
      <span>Новая ставка</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Создать ставку"
      :columns="2"
      @submit="createTeacherRate"
    />
  </ModalLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

import { useFinancesStore } from '@/stores/finances'
import { useSubjectsStore } from '@/stores/subjects'

defineProps({
  isOpenModalCreateTeacherRate: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['closeModalCreateTeacherRate'])

const financesStore = useFinancesStore()
const subjectsStore = useSubjectsStore()

const { subjects } = storeToRefs(subjectsStore)

const errors = ref({})
const formError = ref('')

const subjectOptions = computed(() => {
  return subjects.value.map((subject) => ({
    value: String(subject.id),
    label: subject.name.trim(),
  }))
})

const fields = computed(() => [
  {
    name: 'subjectId',
    label: 'Предмет',
    type: 'select',
    placeholder: 'Выберите предмет',
    required: true,
    options: subjectOptions.value,
    fullWidth: true,
  },
  {
    name: 'lessonDurationMinutes',
    label: 'Длительность занятия',
    type: 'number',
    placeholder: 'Например, 60',
    required: true,
    min: 1,
    step: 1,
  },
  {
    name: 'teacherLevel',
    label: 'Уровень',
    type: 'select',
    placeholder: 'Выберите уровень',
    required: true,
    options: [
      { value: 'junior', label: 'Новичок' },
      { value: 'middle', label: 'Опытный' },
      { value: 'senior', label: 'Старший' },
    ],
  },
  {
    name: 'rate',
    label: 'Ставка',
    type: 'number',
    placeholder: 'Введите сумму',
    required: true,
    min: 0,
    step: 1,
  },
  {
    name: 'color',
    label: 'Цвет карточки',
    type: 'color',
  },
])

function createInitialForm() {
  return {
    subjectId: '',
    lessonDurationMinutes: '',
    teacherLevel: '',
    rate: '',
    color: '#DFF3E2',
    organizationId: 0,
  }
}

const form = ref(createInitialForm())

function resetState() {
  form.value = createInitialForm()
  errors.value = {}
  formError.value = ''
}

function handleClose() {
  resetState()
  emit('closeModalCreateTeacherRate')
}

function validateForm() {
  errors.value = {}
  formError.value = ''

  if (form.value.subjectId === '') {
    errors.value.subjectId = 'Выберите предмет'
  }

  if (form.value.lessonDurationMinutes === '' || Number(form.value.lessonDurationMinutes) <= 0) {
    errors.value.lessonDurationMinutes = 'Введите корректную длительность'
  }

  if (!form.value.teacherLevel) {
    errors.value.teacherLevel = 'Выберите уровень'
  }

  if (form.value.rate === '' || Number(form.value.rate) < 0) {
    errors.value.rate = 'Введите корректную ставку'
  }

  return Object.keys(errors.value).length === 0
}

function createTeacherRate() {
  if (!validateForm()) {
    formError.value = 'Проверьте заполнение полей формы'
    return
  }

  financesStore.createTeacherRate({
    subjectId: Number(form.value.subjectId),
    lessonDurationMinutes: Number(form.value.lessonDurationMinutes),
    teacherLevel: form.value.teacherLevel,
    rate: Number(form.value.rate),
    color: form.value.color,
    organizationId: form.value.organizationId,
  })

  handleClose()
}
</script>
