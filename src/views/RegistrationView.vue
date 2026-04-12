<template>
  <div class="page">
    <div class="header">
      <h1 class="logo">EduKrismash</h1>
    </div>

    <div class="main">
      <form class="form" @submit.prevent="handleRegister">
        <h2 class="form-header">Регистрация</h2>

        <div v-for="field in formFields" :key="field.id" class="Input-item">
          <label :for="field.id">{{ field.label }}</label>
          <input
            :id="field.id"
            v-model="newUser[field.model]"
            :type="field.type"
            :placeholder="field.placeholder"
          />

          <div v-if="errors[field.model]" class="error-message">
            {{ errors[field.model] }}
          </div>
        </div>

        <div v-if="errors.form" class="error-message form-error">
          {{ errors.form }}
        </div>

        <p class="reg-info">
          Вы уже зарегистрированы?
          <router-link class="link" to="/"> Войдите в аккаунт </router-link>
        </p>

        <button class="reg-btn" type="submit">Зарегистрироваться</button>
      </form>
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
.header {
  padding: 40px 100px 8px 100px;
  border-bottom: 2px solid #802e87;
}
.logo {
  font-weight: 500;
  font-size: 40px;
}
.main {
  width: 100%;
}

.form-header {
  margin-bottom: 30px;
  font-size: 40px;
  text-align: start;
  width: 100%;
}

.form {
  width: 900px;
  margin: 0 auto;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 48px;
}

.Input-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
}

.Input-item label {
  font-size: 24px;
  font-weight: 500;
}

.Input-item input,
.Input-item select,
.Input-item textarea {
  width: 100%;
  padding: 16px 14px;
  font-size: 16px;
  border: 1px solid #802e87;
  border-radius: 17px;
  background-color: #f5f5f5;
  outline: none;
  transition: border-color 0.3s;
}

.Input-item input:focus,
.Input-item select:focus,
.Input-item textarea:focus {
  border-color: #5d1e5e;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 4px;
  margin-left: 4px;
}

.form-error {
  width: 100%;
  margin-bottom: 16px;
  font-size: 16px;
}

.reg-info {
  align-items: center;
  margin: 0 auto 20px auto;
  width: fit-content;
  font-size: 26px;
  font-weight: 400;
}

.link {
  font-weight: 600;
  color: #802e87;
  text-decoration: none;
}

.reg-btn {
  padding: 18px 36px;
  font-size: 30px;
  font-weight: bold;
  color: black;
  background-color: #d9bddb;
  border: 2px solid #802e87;
  border-radius: 36px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reg-btn:hover {
  background-color: #bf92c2;
}
</style>
