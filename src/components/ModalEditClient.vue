<template>
  <ModalLayout :IsOpen="IsOpenModalEditClient" @close="handleClose">
    <template #header>
      <span>Редактирование клиента</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Сохранить изменения"
      :columns="2"
      @submit="updateClient"
    />
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

const props = defineProps({
  IsOpenModalEditClient: {
    type: Boolean,
    required: true,
  },
  clientData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['closeModalEditClient', 'saveClient'])

const fields = [
  {
    name: 'surname',
    label: 'Фамилия',
    type: 'text',
    placeholder: 'Введите фамилию',
    required: true,
  },
  {
    name: 'name',
    label: 'Имя',
    type: 'text',
    placeholder: 'Введите имя',
    required: true,
  },
  {
    name: 'patronymic',
    label: 'Отчество',
    type: 'text',
    placeholder: 'Введите отчество',
  },
  {
    name: 'phone',
    label: 'Телефон',
    type: 'tel',
    placeholder: '+7 (999) 999-99-99',
    required: true,
  },
  {
    name: 'email',
    label: 'Электронная почта',
    type: 'email',
    placeholder: 'example@mail.com',
    required: true,
    fullWidth: true,
  },
  {
    name: 'timezone',
    label: 'Часовой пояс',
    type: 'text',
    placeholder: '+3',
  },
  {
    name: 'color',
    label: 'Цвет карточки',
    type: 'color',
  },
  {
    name: 'birthDate',
    label: 'Дата рождения',
    type: 'date',
  },
  {
    name: 'grade',
    label: 'Класс',
    type: 'number',
    placeholder: 'Введите класс',
    min: 1,
    step: 1,
  },
  {
    name: 'balance',
    label: 'Баланс',
    type: 'number',
    placeholder: 'Введите баланс',
    step: 1,
  },
  {
    name: 'status',
    label: 'Статус',
    type: 'select',
    placeholder: 'Выберите статус',
    required: true,
    options: [
      { value: 'active', label: 'Занимается' },
      { value: 'inactive', label: 'Не занимается' },
    ],
    fullWidth: true,
  },
]

const createInitialForm = () => ({
  id: null,
  surname: '',
  name: '',
  patronymic: '',
  email: '',
  phone: '',
  timezone: '+3',
  color: '#E1DEF7',
  birthDate: '',
  grade: '',
  balance: '',
  status: 'active',
  organizationId: 0,
})

const form = ref(createInitialForm())
const errors = ref({})
const formError = ref('')

watch(
  () => props.clientData,
  (value) => {
    errors.value = {}
    formError.value = ''

    if (!value || !Object.keys(value).length) {
      form.value = createInitialForm()
      return
    }

    form.value = {
      id: value.id ?? null,
      surname: value.surname ?? '',
      name: value.name ?? '',
      patronymic: value.patronymic ?? '',
      email: value.email ?? '',
      phone: value.phone ?? '',
      timezone: value.timezone ?? '+3',
      color: value.color ?? '#E1DEF7',
      birthDate: value.birthDate ?? '',
      grade: value.grade ?? '',
      balance: value.balance ?? '',
      status: value.status ?? 'active',
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
  emit('closeModalEditClient')
}

function validateForm() {
  errors.value = {}
  formError.value = ''

  if (!form.value.surname?.trim()) {
    errors.value.surname = 'Введите фамилию'
  }

  if (!form.value.name?.trim()) {
    errors.value.name = 'Введите имя'
  }

  if (!form.value.phone?.trim()) {
    errors.value.phone = 'Введите телефон'
  }

  if (!form.value.email?.trim()) {
    errors.value.email = 'Введите email'
  }

  if (!form.value.status) {
    errors.value.status = 'Выберите статус'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.value.email && !emailRegex.test(form.value.email)) {
    errors.value.email = 'Введите корректный email'
  }

  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/
  if (form.value.phone && !phoneRegex.test(form.value.phone)) {
    errors.value.phone = 'Введите корректный номер телефона'
  }

  return Object.keys(errors.value).length === 0
}

function updateClient() {
  if (!validateForm()) {
    formError.value = 'Проверьте заполнение полей формы'
    return
  }

  emit('saveClient', {
    ...form.value,
    grade: form.value.grade === '' ? null : Number(form.value.grade),
    balance: form.value.balance === '' ? 0 : Number(form.value.balance),
  })
}
</script>
