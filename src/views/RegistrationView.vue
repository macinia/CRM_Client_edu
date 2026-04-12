<template>
  <div class="auth-page">
    <div class="auth-layout registration-layout">
      <section class="auth-brand">
        <div class="brand-badge">Создание администратора</div>
        <h1 class="brand-title">EduKrismash</h1>
        <p class="brand-text">
          Зарегистрируйте основной аккаунт и начните работать с CRM онлайн-школы.
        </p>
      </section>

      <section class="auth-card">
        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="form-top">
            <h2 class="form-title">Регистрация</h2>
            <p class="form-subtitle">Заполните данные администратора для первого входа</p>
          </div>

          <div class="form-grid">
            <div
              v-for="field in formFields"
              :key="field.id"
              :class="['form-field', { 'full-width': isWideField(field.model) }]"
            >
              <label :for="field.id" class="form-label">{{ field.label }}</label>

              <input
                :id="field.id"
                v-model="newUser[field.model]"
                :type="field.type"
                :placeholder="field.placeholder"
                class="form-input"
              />

              <div v-if="errors[field.model]" class="error-message">
                {{ errors[field.model] }}
              </div>
            </div>
          </div>

          <div v-if="errors.form" class="error-message form-error">
            {{ errors.form }}
          </div>

          <button class="submit-btn" type="submit">Зарегистрироваться</button>

          <p class="bottom-text">
            Вы уже зарегистрированы?
            <router-link class="bottom-link" to="/"> Войдите в аккаунт </router-link>
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const newUser = ref({
  surname: '',
  name: '',
  patronymic: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({})

const formFields = [
  {
    id: 'surname',
    label: 'Фамилия',
    type: 'text',
    model: 'surname',
    placeholder: 'Введите фамилию',
    required: true,
  },
  {
    id: 'name',
    label: 'Имя',
    type: 'text',
    model: 'name',
    placeholder: 'Введите имя',
    required: true,
  },
  {
    id: 'patronymic',
    label: 'Отчество',
    type: 'text',
    model: 'patronymic',
    placeholder: 'Введите отчество',
    required: false,
  },
  {
    id: 'phone',
    label: 'Номер телефона',
    type: 'tel',
    model: 'phone',
    placeholder: '+7 (___) ___-__-__',
    required: false,
  },
  {
    id: 'email',
    label: 'Почта',
    type: 'email',
    model: 'email',
    placeholder: 'example@mail.ru',
    required: true,
  },
  {
    id: 'password',
    label: 'Пароль',
    type: 'password',
    model: 'password',
    placeholder: 'Не менее 6 символов',
    required: true,
  },
  {
    id: 'confirmPassword',
    label: 'Подтверждение пароля',
    type: 'password',
    model: 'confirmPassword',
    placeholder: 'Повторите пароль',
    required: true,
  },
]

const isWideField = (model) => {
  return ['email', 'password', 'confirmPassword'].includes(model)
}

const validateForm = () => {
  errors.value = {}

  formFields.forEach((field) => {
    if (field.required && !newUser.value[field.model]?.trim()) {
      errors.value[field.model] = `Поле "${field.label}" обязательно для заполнения`
    }
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (newUser.value.email && !emailRegex.test(newUser.value.email)) {
    errors.value.email = 'Введите корректный email адрес'
  }

  const phoneDigits = newUser.value.phone.replace(/\D/g, '')
  if (newUser.value.phone && !/^7\d{10}$|^8\d{10}$/.test(phoneDigits)) {
    errors.value.phone = 'Введите корректный номер телефона'
  }

  if (newUser.value.password && newUser.value.password.length < 6) {
    errors.value.password = 'Пароль должен содержать минимум 6 символов'
  }

  if (newUser.value.password !== newUser.value.confirmPassword) {
    errors.value.confirmPassword = 'Пароли не совпадают'
  }

  return Object.keys(errors.value).length === 0
}

const resetForm = () => {
  newUser.value = {
    surname: '',
    name: '',
    patronymic: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  }
}

const handleRegister = async () => {
  const isValid = validateForm()

  if (!isValid) {
    return
  }

  const userData = {
    surname: newUser.value.surname,
    name: newUser.value.name,
    patronymic: newUser.value.patronymic,
    email: newUser.value.email,
    phone: newUser.value.phone,
    password: newUser.value.password,
    role: 'admin',
  }

  const result = await authStore.registerUser(userData)

  if (!result.success) {
    errors.value.form = result.message
    return
  }

  resetForm()
  router.push('/company')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(128, 46, 135, 0.08), transparent 28%),
    radial-gradient(circle at bottom right, rgba(128, 46, 135, 0.1), transparent 26%),
    var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-layout {
  width: 100%;
  max-width: 1240px;
  min-height: 760px;
  display: grid;
  grid-template-columns: 1fr 620px;
  border-radius: 32px;
  overflow: hidden;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.auth-brand {
  padding: 56px;
  background: linear-gradient(145deg, #f4e9f5 0%, #ead9ec 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
}

.brand-badge {
  width: fit-content;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background-color: rgba(128, 46, 135, 0.1);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 800;
}

.brand-title {
  font-size: 52px;
  font-weight: 900;
  line-height: 1.05;
  color: var(--color-text);
}

.brand-text {
  max-width: 460px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.auth-card {
  padding: 36px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
}

.form-top {
  margin-bottom: 28px;
}

.form-title {
  font-size: 34px;
  font-weight: 900;
  color: var(--color-text);
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
  line-height: 1.45;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  font-size: 15px;
  color: var(--color-text);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-base);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.error-message {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-danger);
}

.form-error {
  margin-top: 16px;
}

.submit-btn {
  margin-top: 18px;
  min-height: 52px;
  border-radius: 14px;
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  transition:
    background-color var(--transition-base),
    transform var(--transition-base);
}

.submit-btn:hover {
  background-color: var(--color-primary-hover);
}

.bottom-text {
  margin-top: 18px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.bottom-link {
  color: var(--color-primary);
  font-weight: 800;
}
</style>
