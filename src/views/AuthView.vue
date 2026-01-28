<template>
  <div class="page">
    <div class="header">
      <h1 class="logo">EduKrismash</h1>
    </div>
    <div class="main">
      <div class="form">
        <h2 class="form-header">Вход</h2>

        <div v-for="field in formFields" :key="field.id" class="Input-item">
          <label :for="field.id">{{ field.label }}</label>
          <input
            :type="field.type"
            :id="field.id"
            v-model="authUser[field.model]"
            :placeholder="field.placeholder"
          />

          <div v-if="errors[field.model]" class="error-message">
            {{ errors[field.model] }}
          </div>
        </div>

        <p class="reg-info">
          У вас нет аккаунта?
          <router-link class="link" to="/registration"> Зарегистрируйтесь </router-link>
        </p>
        <button class="reg-btn" @click="handleAuth">Войти</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const authUser = ref({
  email: '',
  password: '',
})

const errors = ref({})

const formFields = ref([
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
    required: true,
  },
])

const handleAuth = async () => {
  const userData = { ...authUser.value }
  delete userData.confirmPassword

  await authStore.authUser(userData)
  authUser.value = {
    email: '',
    password: '',
  }
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
  margin: 0px auto;
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

.reg-info {
  align-items: center;
  margin: 0px auto;
  width: fit-content;
  font-size: 26px;
  font-weight: 400;
  margin-bottom: 20px;
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
