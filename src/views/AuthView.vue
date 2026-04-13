<template>
  <div class="auth-page">
    <div class="auth-layout">
      <section class="auth-brand">
        <div class="brand-badge">CRM для онлайн-школы</div>
        <h1 class="brand-title">EduKrismash</h1>
        <p class="brand-text">
          Управляйте сотрудниками, клиентами, занятиями и финансами в одном месте.
        </p>
      </section>

      <section class="auth-card">
        <form class="auth-form" @submit.prevent="handleAuth">
          <div class="form-top">
            <h2 class="form-title">Вход</h2>
            <p class="form-subtitle">Введите данные аккаунта для входа в систему</p>
          </div>

          <div v-for="field in formFields" :key="field.id" class="form-field">
            <label :for="field.id" class="form-label">{{ field.label }}</label>

            <input
              :id="field.id"
              v-model="authUser[field.model]"
              :type="field.type"
              :placeholder="field.placeholder"
              class="form-input"
            />

            <div v-if="errors[field.model]" class="error-message">
              {{ errors[field.model] }}
            </div>
          </div>

          <div v-if="errors.form" class="error-message form-error">
            {{ errors.form }}
          </div>

          <button class="submit-btn" type="submit">Войти</button>

          <p class="bottom-text">
            У вас нет аккаунта?
            <router-link class="bottom-link" to="/registration"> Зарегистрируйтесь </router-link>
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

const authUser = ref({
  email: '',
  password: '',
})

const errors = ref({})

const formFields = [
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
    placeholder: 'Введите пароль',
    required: true,
  },
]

const validateForm = () => {
  errors.value = {}

  if (!authUser.value.email.trim()) {
    errors.value.email = 'Введите email'
  }

  if (!authUser.value.password.trim()) {
    errors.value.password = 'Введите пароль'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (authUser.value.email && !emailRegex.test(authUser.value.email)) {
    errors.value.email = 'Введите корректный email адрес'
  }

  return Object.keys(errors.value).length === 0
}

const resetForm = () => {
  authUser.value = {
    email: '',
    password: '',
  }
}

const handleAuth = async () => {
  const isValid = validateForm()

  if (!isValid) {
    return
  }

  const result = await authStore.authUser({
    email: authUser.value.email,
    password: authUser.value.password,
  })

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
  max-width: 1120px;
  min-height: 680px;
  display: grid;
  grid-template-columns: 1fr 480px;
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
  max-width: 440px;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.auth-card {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 360px;
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

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
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
  margin-bottom: 16px;
}

.submit-btn {
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
