<template>
  <ModalLayout :IsOpen="IsOpenModalCreateEmployer" @close="$emit('closeModalCreateEmployer')">
    <template #header>
      <span>Новый сотрудник</span>
    </template>

    <form class="employer-form" @submit.prevent="createEmployer">
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

        <select
          v-else
          :id="field.name"
          v-model="form[field.name]"
          :required="field.required"
          @change="handleRoleChange"
        >
          <option value="">{{ field.placeholder }}</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div v-if="form.role === 'teacher'" class="subjects-block">
        <div class="subjects-title">Предметы</div>

        <div v-for="(subject, index) in form.subjects" :key="index" class="Input-item">
          <label :for="`subject-${index}`">Предмет {{ index + 1 }}</label>

          <div class="subject-input-wrapper">
            <input
              :id="`subject-${index}`"
              v-model="form.subjects[index]"
              type="text"
              placeholder="Введите название предмета"
            />

            <button
              v-if="index === form.subjects.length - 1"
              type="button"
              class="add-subject-btn"
              @click="addSubject"
            >
              +
            </button>

            <button
              v-if="form.subjects.length > 1"
              type="button"
              class="remove-subject-btn"
              @click="removeSubject(index)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="Input-item">
        <label for="notes">Примечания</label>
        <textarea id="notes" v-model="form.notes" placeholder="Введите примечания" rows="3" />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Создать сотрудника</button>
      </div>
    </form>
  </ModalLayout>
</template>

<script setup>
import { ref } from 'vue'
import ModalLayout from './ModalLayout.vue'
import { useEmployersStore } from '@/stores/employers'

defineProps({
  IsOpenModalCreateEmployer: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['closeModalCreateEmployer'])
const employersStore = useEmployersStore()

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
    placeholder: '#802e87',
    required: false,
  },
  {
    name: 'role',
    label: 'Роль',
    type: 'select',
    placeholder: 'Выберите роль',
    required: true,
    options: [
      { value: 'admin', label: 'Администратор' },
      { value: 'manager', label: 'Менеджер' },
      { value: 'teacher', label: 'Преподаватель' },
    ],
  },
]

const createInitialForm = () => ({
  surname: '',
  name: '',
  patronymic: '',
  email: '',
  phone: '',
  timezone: '+3',
  role: '',
  color: '#802e87',
  notes: '',
  subjects: [''],
  grades: [],
  status: 'active',
  organizationId: 0,
})

const form = ref(createInitialForm())

function handleRoleChange() {
  if (form.value.role === 'teacher' && !form.value.subjects.length) {
    form.value.subjects = ['']
    return
  }

  if (form.value.role !== 'teacher') {
    form.value.subjects = ['']
  }
}

function addSubject() {
  form.value.subjects.push('')
}

function removeSubject(index) {
  if (form.value.subjects.length === 1) return
  form.value.subjects.splice(index, 1)
}

function validateForm() {
  if (
    !form.value.surname ||
    !form.value.name ||
    !form.value.phone ||
    !form.value.email ||
    !form.value.role
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

function createEmployer() {
  if (!validateForm()) return

  const employer = {
    ...form.value,
    subjects:
      form.value.role === 'teacher'
        ? form.value.subjects.filter((subject) => subject.trim() !== '')
        : [],
  }

  employersStore.createEmployer(employer)
  form.value = createInitialForm()
  emit('closeModalCreateEmployer')
}
</script>

<style scoped>
.employer-form {
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
.Input-item select,
.Input-item textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 2px solid #802e87;
  border-radius: 17px;
  background-color: #f5f5f5;
  outline: none;
}

.Input-item input:focus,
.Input-item select:focus,
.Input-item textarea:focus {
  border-color: #5d1e5e;
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.1);
}

.subjects-block {
  margin: 8px 0 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border: 2px solid #802e87;
  border-radius: 17px;
}

.subjects-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.subject-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.subject-input-wrapper input {
  flex: 1;
}

.add-subject-btn,
.remove-subject-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.add-subject-btn {
  background-color: #4caf50;
  color: white;
}

.remove-subject-btn {
  background-color: #f44336;
  color: white;
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
