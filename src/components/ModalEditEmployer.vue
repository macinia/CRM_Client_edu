<template>
  <ModalLayout :IsOpen="isOpenModalEditEmployer" @close="$emit('closeModalEditEmployer')">
    <template #header>
      <span>Редактирование сотрудника</span>
    </template>

    <form @submit.prevent="updateEmployer()">
      <!-- Основные поля пользователя -->
      <div v-for="field in userFields" :key="field.name" class="Input-item">
        <label :for="field.name">{{ field.label }}</label>

        <!-- Обработка разных типов полей -->
        <input
          v-if="
            field.type === 'text' ||
            field.type === 'email' ||
            field.type === 'tel' ||
            field.type === 'password' ||
            field.type === 'color'
          "
          :id="field.name"
          :type="field.type"
          :placeholder="field.placeholder"
          v-model="editEmployerInputs.user[field.name]"
          :required="field.required"
        />

        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="editEmployerInputs.user[field.name]"
          :required="field.required"
          @change="handleRoleChange"
        >
          <option value="">{{ field.placeholder || 'Выберите роль' }}</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Блок предметов для преподавателя -->
      <div v-if="editEmployerInputs.user.role === 'Преподаватель'" class="subjects-block">
        <div
          v-for="(subject, index) in editEmployerInputs.subjects"
          :key="index"
          class="Input-item"
        >
          <label :for="'subject-' + index">Предмет {{ index + 1 }}</label>
          <div class="subject-input-wrapper">
            <!-- Изменено: теперь работаем с объектами предметов -->
            <input
              :id="'subject-' + index"
              type="text"
              v-model="subject.name"
              placeholder="Введите название предмета"
            />
            <button
              v-if="index === editEmployerInputs.subjects.length - 1"
              type="button"
              class="add-subject-btn"
              @click="addSubject"
              title="Добавить предмет"
            >
              +
            </button>
            <button
              v-if="editEmployerInputs.subjects.length > 1"
              type="button"
              class="remove-subject-btn"
              @click="removeSubject(index)"
              title="Удалить предмет"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Поле примечаний -->
      <div class="Input-item">
        <label for="notes">Примечания</label>
        <textarea
          id="notes"
          v-model="editEmployerInputs.notes"
          placeholder="Введите примечания"
          rows="3"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Сохранить изменения</button>
      </div>
    </form>
  </ModalLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ModalLayout from './ModalLayout.vue'

const emit = defineEmits(['closeModalEditEmployer', 'saveEmployer'])

const props = defineProps({
  isOpenModalEditEmployer: {
    type: Boolean,
    required: true,
  },
  employerData: {
    type: Object,
    required: true,
  },
})

const userFields = computed(() => [
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
    label: 'Номер телефона',
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
    name: 'hex',
    label: 'Цвет',
    type: 'color',
    placeholder: '#802e87',
    required: false,
  },
  {
    name: 'role',
    label: 'Роль в системе',
    type: 'select',
    placeholder: 'Выберите роль',
    required: true,
    options: [
      { value: 'Администратор', label: 'Администратор' },
      { value: 'Менеджер', label: 'Менеджер' },
      { value: 'Преподаватель', label: 'Преподаватель' },
    ],
  },
  {
    name: 'password',
    label: 'Новый пароль (оставьте пустым, если не хотите менять)',
    type: 'password',
    placeholder: 'Введите новый пароль',
    required: false,
  },
])

// Данные формы
const editEmployerInputs = ref({
  id: null,
  user: {
    surname: '',
    name: '',
    patronymic: '',
    email: '',
    phone: '',
    timezone: '',
    role: '',
    hex: '#802e87',
    password: '',
  },
  subjects: [],
  notes: '',
})

// Загрузка данных сотрудника при открытии модалки
watch(
  () => props.employerData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      loadEmployerData(newData)
    }
  },
  { immediate: true, deep: true },
)

// Загрузка данных сотрудника в форму
const loadEmployerData = (data) => {
  editEmployerInputs.value.id = data.id || null

  // Заполняем данные пользователя
  editEmployerInputs.value.user = {
    surname: data.user?.surname || '',
    name: data.user?.name || '',
    patronymic: data.user?.patronymic || '',
    email: data.user?.email || '',
    phone: data.user?.phone || '',
    timezone: data.user?.timezone || '',
    role: data.user?.role || '',
    hex: data.user?.hex || '#802e87',
    password: '', // Пароль не загружаем для безопасности
  }

  // Заполняем предметы (теперь это массив объектов)
  if (data.subjects && data.subjects.length > 0) {
    // Копируем объекты предметов
    editEmployerInputs.value.subjects = data.subjects.map((subject) => ({ ...subject }))
  } else {
    editEmployerInputs.value.subjects = [{ name: '', id: null }]
  }

  // Заполняем примечания
  editEmployerInputs.value.notes = data.notes || ''
}

// Обработка смены роли
const handleRoleChange = () => {
  if (editEmployerInputs.value.user.role !== 'Преподаватель') {
    editEmployerInputs.value.subjects = []
  }
}

// Методы для работы с предметами
const addSubject = () => {
  editEmployerInputs.value.subjects.push({ name: '', id: null })
}

const removeSubject = (index) => {
  if (editEmployerInputs.value.subjects.length > 1) {
    editEmployerInputs.value.subjects.splice(index, 1)
  }
}

// Валидация формы
const validateForm = () => {
  const { surname, name, email, phone, role } = editEmployerInputs.value.user

  if (!surname || !name || !email || !phone || !role) {
    alert('Пожалуйста, заполните все обязательные поля')
    return false
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert('Пожалуйста, введите корректный email')
    return false
  }

  // Валидация телефона
  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/
  if (!phoneRegex.test(phone)) {
    alert('Пожалуйста, введите корректный номер телефона')
    return false
  }

  return true
}

// Обновление сотрудника
const updateEmployer = async () => {
  if (!validateForm()) return

  // Фильтруем пустые предметы
  const filteredSubjects = editEmployerInputs.value.subjects
    .filter((s) => s.name && s.name.trim() !== '')
    .map((s) => ({
      ...s,
      name: s.name.trim(),
    }))

  // Формируем объект для отправки
  let updatedEmployer = {
    id: props.employerData.id,
    user: { ...editEmployerInputs.value.user, id: props.employerData.user.id },
    notes: editEmployerInputs.value.notes,
  }

  // Добавляем предметы только если они есть
  if (filteredSubjects.length > 0) {
    updatedEmployer.subjects = filteredSubjects
  }

  // Удаляем пароль, если он пустой (не меняем)
  if (!updatedEmployer.user.password) {
    delete updatedEmployer.user.password
  }

  try {
    emit('saveEmployer', updatedEmployer)
    emit('closeModalEditEmployer')
  } catch (error) {
    console.error('Ошибка при обновлении сотрудника:', error)
    alert('Произошла ошибка при обновлении данных сотрудника')
  }
}

// Сброс формы (можно использовать при закрытии)
const resetForm = () => {
  editEmployerInputs.value = {
    id: null,
    user: {
      surname: '',
      name: '',
      patronymic: '',
      email: '',
      phone: '',
      timezone: '',
      role: '',
      hex: '#802e87',
      password: '',
    },
    subjects: [],
    notes: '',
  }
}
</script>

<style scoped>
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
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.Input-item input:focus,
.Input-item select:focus,
.Input-item textarea:focus {
  border-color: #5d1e5e;
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.1);
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
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.add-subject-btn {
  background-color: #4caf50;
  color: white;
}

.add-subject-btn:hover {
  background-color: #45a049;
  transform: scale(1.1);
}

.remove-subject-btn {
  background-color: #f44336;
  color: white;
}

.remove-subject-btn:hover {
  background-color: #da190b;
  transform: scale(1.1);
}

.subjects-block {
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 17px;
  border: 2px solid #802e87;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 17px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn {
  background-color: #802e87;
  color: black;
}

.submit-btn:hover {
  background-color: #5d1e5e;
  transform: translateY(-2px);
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #da190b;
  transform: translateY(-2px);
}

.submit-btn:active,
.cancel-btn:active {
  transform: translateY(0);
}

/* Стили для поля color */
input[type='color'] {
  height: 50px;
  padding: 5px;
  cursor: pointer;
}
</style>
