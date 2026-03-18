<template>
  <ModalLayout :IsOpen="IsOpenModalEditClient" @close="$emit('closeModalEditClient')">
    <template #header>
      <span>Редактирование</span>
    </template>
    <form @submit.prevent="editClient()">
      <div v-for="field in clientFields" :key="field.name" class="Input-item">
        <label :for="field.name">{{ field.label }}</label>

        <input
          v-if="
            field.type === 'text' ||
            field.type === 'email' ||
            field.type === 'tel' ||
            field.type === 'color' ||
            field.type === 'date' ||
            field.type === 'number'
          "
          :id="field.name"
          :type="field.type"
          v-model="editClientInputs[field.name]"
        />

        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="editClientInputs[field.name]"
        >
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <button @click="handleEditClient()" type="submit">Изменить</button>
    </form>
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalLayout from './ModalLayout.vue'

const emit = defineEmits(['closeModalEditClient', 'saveClient'])

const props = defineProps({
  IsOpenModalEditClient: {
    type: Boolean,
  },
  clientData: {
    type: Object,
  },
})

const clientFields = [
  {
    name: 'surname',
    label: 'Фамилия',
    type: 'text',
  },
  {
    name: 'name',
    label: 'Имя',
    type: 'text',
  },
  {
    name: 'patronymic',
    label: 'Отчество',
    type: 'text',
  },
  {
    name: 'phone',
    label: 'Номер телефона',
    type: 'tel',
  },
  {
    name: 'email',
    label: 'Почта',
    type: 'email',
  },
  {
    name: 'timezone',
    label: 'Часовой пояс',
    type: 'text',
  },
  {
    name: 'hex',
    label: 'Цвет',
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
  },
  {
    name: 'balance',
    label: 'Баланс',
    type: 'number',
  },
  {
    name: 'status',
    label: 'Статус',
    type: 'select',
    options: [
      { value: 'active', label: 'Занимается' },
      { value: 'unactive', label: 'Не занимается' },
    ],
  },
]

const editClientInputs = ref({
  id: 0,
  surname: '',
  name: '',
  patronymic: '',
  email: '',
  phone: '',
  timezone: '',
  hex: '',
  birthDate: '',
  grade: '',
  balance: '',
  status: '',
})

const handleEditClient = () => {
  emit('saveClient', editClientInputs.value)
  emit('closeModalEditClient')
}

watch(
  () => props.clientData,
  () => {
    editClientInputs.value = { ...props.clientData }
  },
)
</script>

<style scoped>
.Input-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.Input-item label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.Input-item input,
.Input-item select {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 2px solid #802e87;
  border-radius: 17px;
  background-color: #f5f5f5;
  outline: none;
  transition: border-color 0.3s;
}

.Input-item input:focus,
.Input-item select:focus {
  border-color: #5d1e5e;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  color: black;
  background-color: #802e87;
  border: none;
  border-radius: 17px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5d1e5e;
}
</style>
