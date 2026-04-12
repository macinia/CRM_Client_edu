<template>
  <ModalLayout :IsOpen="isOpenModalEditEmployer" @close="handleClose">
    <template #header>
      <span>Редактирование сотрудника</span>
    </template>

    <UiFormBuilder
      v-model="form"
      :fields="fields"
      :errors="errors"
      :form-error="formError"
      submit-label="Сохранить изменения"
      :columns="2"
      @submit="updateEmployer"
    >
      <template #after-fields>
        <div v-if="form.role === 'teacher'" class="subjects-block">
          <div class="subjects-title">Предметы</div>

          <div v-for="(subject, index) in form.subjects" :key="index" class="subject-field">
            <label :for="`subject-${index}`" class="subject-label"> Предмет {{ index + 1 }} </label>

            <div class="subject-input-wrapper">
              <input
                :id="`subject-${index}`"
                v-model="form.subjects[index]"
                type="text"
                placeholder="Введите название предмета"
                class="subject-input"
              />

              <button
                v-if="index === form.subjects.length - 1"
                type="button"
                class="circle-btn add-btn"
                @click="addSubject"
              >
                +
              </button>

              <button
                v-if="form.subjects.length > 1"
                type="button"
                class="circle-btn remove-btn"
                @click="removeSubject(index)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </template>
    </UiFormBuilder>
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalLayout from './ModalLayout.vue'
import UiFormBuilder from '@/components/ui/UiFormBuilder.vue'

const props = defineProps({
  isOpenModalEditEmployer: {
    type: Boolean,
    required: true,
  },
  employerData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['closeModalEditEmployer', 'saveEmployer'])

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
  {
    name: 'notes',
    label: 'Примечания',
    type: 'textarea',
    placeholder: 'Введите примечания',
    rows: 3,
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
  role: '',
  color: '#802e87',
  notes: '',
  subjects: [''],
  grades: [],
  status: 'active',
  organizationId: 0,
})

const form = ref(createInitialForm())
const errors = ref({})
const formError = ref('')

watch(
  () => props.employerData,
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
      role: value.role ?? '',
      color: value.color ?? '#802e87',
      notes: value.notes ?? '',
      subjects: Array.isArray(value.subjects) && value.subjects.length ? [...value.subjects] : [''],
      grades: Array.isArray(value.grades) ? [...value.grades] : [],
      status: value.status ?? 'active',
      organizationId: value.organizationId ?? 0,
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => form.value.role,
  (role) => {
    if (role === 'teacher') {
      if (!form.value.subjects.length) {
        form.value.subjects = ['']
      }
      return
    }

    form.value.subjects = ['']
  },
)

function resetErrors() {
  errors.value = {}
  formError.value = ''
}

function handleClose() {
  resetErrors()
  emit('closeModalEditEmployer')
}

function addSubject() {
  form.value.subjects.push('')
}

function removeSubject(index) {
  if (form.value.subjects.length === 1) return
  form.value.subjects.splice(index, 1)
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

  if (!form.value.role) {
    errors.value.role = 'Выберите роль'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.value.email && !emailRegex.test(form.value.email)) {
    errors.value.email = 'Введите корректный email'
  }

  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/
  if (form.value.phone && !phoneRegex.test(form.value.phone)) {
    errors.value.phone = 'Введите корректный номер телефона'
  }

  if (form.value.role === 'teacher') {
    const validSubjects = form.value.subjects.filter((subject) => subject.trim() !== '')
    if (!validSubjects.length) {
      formError.value = 'Для преподавателя нужно указать хотя бы один предмет'
    }
  }

  return Object.keys(errors.value).length === 0 && !formError.value
}

function updateEmployer() {
  if (!validateForm()) {
    if (!formError.value) {
      formError.value = 'Проверьте заполнение полей формы'
    }
    return
  }

  emit('saveEmployer', {
    ...form.value,
    subjects:
      form.value.role === 'teacher'
        ? form.value.subjects.filter((subject) => subject.trim() !== '')
        : [],
  })
}
</script>

<style scoped>
.subjects-block {
  grid-column: 1 / -1;
  margin-top: 2px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background-color: var(--color-surface-muted);
}

.subjects-title {
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
}

.subject-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subject-field + .subject-field {
  margin-top: 14px;
}

.subject-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

.subject-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subject-input {
  flex: 1;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.subject-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.subject-input::placeholder {
  color: var(--color-text-muted);
}

.circle-btn {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  transition:
    transform var(--transition-base),
    opacity var(--transition-base);
}

.circle-btn:hover {
  transform: translateY(-1px);
}

.add-btn {
  background-color: #4caf50;
}

.remove-btn {
  background-color: #f44336;
}
</style>
