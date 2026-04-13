<template>
  <ModalLayout :IsOpen="isOpenModalEditTariff" @close="handleClose">
    <template #header>
      <span>Редактирование тарифа</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Сохранить изменения"
      :columns="2"
      @submit="updateTariff"
    />
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

const props = defineProps({
  isOpenModalEditTariff: {
    type: Boolean,
    required: true,
  },
  tariffData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['closeModalEditTariff', 'saveTariff'])

const errors = ref({})
const formError = ref('')

const fields = [
  {
    name: 'title',
    label: 'Название тарифа',
    type: 'text',
    placeholder: 'Введите название тарифа',
    required: true,
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
    name: 'lessonsCount',
    label: 'Количество занятий',
    type: 'number',
    placeholder: 'Например, 8',
    required: true,
    min: 1,
    step: 1,
  },
  {
    name: 'format',
    label: 'Формат',
    type: 'select',
    placeholder: 'Выберите формат',
    required: true,
    options: [
      { value: 'individual', label: 'Индивидуальный' },
      { value: 'group', label: 'Групповой' },
    ],
  },
  {
    name: 'price',
    label: 'Стоимость',
    type: 'number',
    placeholder: 'Введите стоимость',
    required: true,
    min: 0,
    step: 1,
  },
  {
    name: 'color',
    label: 'Цвет карточки',
    type: 'color',
  },
]

function createInitialForm() {
  return {
    id: null,
    title: '',
    lessonDurationMinutes: '',
    lessonsCount: '',
    format: 'individual',
    price: '',
    color: '#F0EFC2',
  }
}

const form = ref(createInitialForm())

watch(
  () => props.tariffData,
  (value) => {
    errors.value = {}
    formError.value = ''

    if (!value || !Object.keys(value).length) {
      form.value = createInitialForm()
      return
    }

    form.value = {
      id: value.id ?? null,
      title: value.title ?? '',
      lessonDurationMinutes: value.lessonDurationMinutes ?? '',
      lessonsCount: value.lessonsCount ?? '',
      format: value.format ?? 'individual',
      price: value.price ?? '',
      color: value.color ?? '#F0EFC2',
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
  emit('closeModalEditTariff')
}

function validateForm() {
  errors.value = {}
  formError.value = ''

  if (!form.value.title?.trim()) {
    errors.value.title = 'Введите название тарифа'
  }

  if (form.value.lessonDurationMinutes === '' || Number(form.value.lessonDurationMinutes) <= 0) {
    errors.value.lessonDurationMinutes = 'Введите корректную длительность'
  }

  if (form.value.lessonsCount === '' || Number(form.value.lessonsCount) <= 0) {
    errors.value.lessonsCount = 'Введите корректное количество занятий'
  }

  if (!form.value.format) {
    errors.value.format = 'Выберите формат'
  }

  if (form.value.price === '' || Number(form.value.price) < 0) {
    errors.value.price = 'Введите корректную стоимость'
  }

  return Object.keys(errors.value).length === 0
}

function updateTariff() {
  if (!validateForm()) {
    formError.value = 'Проверьте заполнение полей формы'
    return
  }

  emit('saveTariff', {
    id: form.value.id,
    title: form.value.title.trim(),
    lessonDurationMinutes: Number(form.value.lessonDurationMinutes),
    lessonsCount: Number(form.value.lessonsCount),
    format: form.value.format,
    price: Number(form.value.price),
    color: form.value.color,
  })
}
</script>
