<template>
  <ModalLayout :IsOpen="isOpenModalEditTeacherRate" @close="handleClose">
    <template #header>
      <span>Редактирование ставки</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Сохранить изменения"
      :columns="2"
      @submit="updateTeacherRate"
    />
  </ModalLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

import { useSubjectsStore } from '@/stores/subjects'

const props = defineProps({
  isOpenModalEditTeacherRate: {
    type: Boolean,
    required: true,
  },
  teacherRateData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['closeModalEditTeacherRate', 'saveTeacherRate'])

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
    id: null,
    subjectId: '',
    lessonDurationMinutes: '',
    teacherLevel: '',
    rate: '',
    color: '#DFF3E2',
    organizationId: 0,
  }
}

const form = ref(createInitialForm())

watch(
  () => props.teacherRateData,
  (value) => {
    errors.value = {}
    formError.value = ''

    if (!value || !Object.keys(value).length) {
      form.value = createInitialForm()
      return
    }

    form.value = {
      id: value.id ?? null,
      subjectId:
        value.subjectId !== undefined && value.subjectId !== null ? String(value.subjectId) : '',
      lessonDurationMinutes: value.lessonDurationMinutes ?? '',
      teacherLevel: value.teacherLevel ?? '',
      rate: value.rate ?? '',
      color: value.color ?? '#DFF3E2',
      organizationId: value.organizationId ?? 0,
    }
  },
  { immediate: true, deep: true },
)

function resetErrors() {
  errors.value = {}
  formError.value = ''
}

function handleClose() {
  resetErrors()
  emit('closeModalEditTeacherRate')
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

function updateTeacherRate() {
  if (!validateForm()) {
    formError.value = 'Проверьте заполнение полей формы'
    return
  }

  emit('saveTeacherRate', {
    id: form.value.id,
    subjectId: Number(form.value.subjectId),
    lessonDurationMinutes: Number(form.value.lessonDurationMinutes),
    teacherLevel: form.value.teacherLevel,
    rate: Number(form.value.rate),
    color: form.value.color,
    organizationId: form.value.organizationId,
  })
}
</script>
