<template>
  <ModalLayout :IsOpen="isOpenModalCreateTariff" @close="handleClose">
    <template #header>
      <span>Новый тариф</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Создать тариф"
      :columns="2"
      @submit="createTariff"
    />
  </ModalLayout>
</template>

<script setup>
import { ref } from 'vue'

import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

import { useFinancesStore } from '@/stores/finances'

defineProps({
  isOpenModalCreateTariff: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['closeModalCreateTariff'])

const financesStore = useFinancesStore()

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
    title: '',
    lessonDurationMinutes: '',
    lessonsCount: '',
    format: 'individual',
    price: '',
    color: '#F0EFC2',
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
  emit('closeModalCreateTariff')
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

function createTariff() {
  if (!validateForm()) {
    formError.value = 'Проверьте заполнение полей формы'
    return
  }

  financesStore.createTariff({
    title: form.value.title.trim(),
    lessonDurationMinutes: Number(form.value.lessonDurationMinutes),
    lessonsCount: Number(form.value.lessonsCount),
    format: form.value.format,
    price: Number(form.value.price),
    color: form.value.color,
  })

  handleClose()
}
</script>
