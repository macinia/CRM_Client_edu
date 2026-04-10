<template>
  <ModalLayout :IsOpen="IsOpenModalEditClient" @close="$emit('closeModalEditClient')">
    <template #header>
      <span>Редактирование клиента</span>
    </template>

    <form class="client-form" @submit.prevent="updateClient">
      <div class="Input-item" v-for="field in fields" :key="field.name">
        <label :for="field.name">{{ field.label }}</label>

        <input
          v-if="field.type !== 'select'"
          :id="field.name"
          v-model="form[field.name]"
          :type="field.type"
          :placeholder="field.placeholder"
          :required="field.required"
        />

        <select v-else :id="field.name" v-model="form[field.name]" :required="field.required">
          <option value="">{{ field.placeholder }}</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Сохранить изменения</button>
      </div>
    </form>
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalLayout from './ModalLayout.vue'

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
    required: false,
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
  },
  {
    name: 'timezone',
    label: 'Часовой пояс',
    type: 'text',
    placeholder: '+3',
    required: false,
  },
  {
    name: 'color',
    label: 'Цвет карточки',
    type: 'color',
    placeholder: '#E1DEF7',
    required: false,
  },
  {
    name: 'birthDate',
    label: 'Дата рождения',
    type: 'date',
    placeholder: '',
    required: false,
  },
  {
    name: 'grade',
    label: 'Класс',
    type: 'number',
    placeholder: 'Введите класс',
    required: false,
  },
  {
    name: 'balance',
    label: 'Баланс',
    type: 'number',
    placeholder: 'Введите баланс',
    required: false,
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

watch(
  () => props.clientData,
  (value) => {
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

function validateForm() {
  if (
    !form.value.surname ||
    !form.value.name ||
    !form.value.phone ||
    !form.value.email ||
    !form.value.status
  ) {
    alert('Заполните обязательные поля')
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    alert('Введите корректный email')
    return false
  }

  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/
  if (!phoneRegex.test(form.value.phone)) {
    alert('Введите корректный номер телефона')
    return false
  }

  return true
}

function updateClient() {
  if (!validateForm()) return

  emit('saveClient', {
    ...form.value,
    grade: form.value.grade === '' ? null : Number(form.value.grade),
    balance: form.value.balance === '' ? 0 : Number(form.value.balance),
  })
}
</script>

<style scoped>
.client-form {
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

input[type='color'] {
  height: 50px;
  padding: 5px;
  cursor: pointer;
}
</style>
