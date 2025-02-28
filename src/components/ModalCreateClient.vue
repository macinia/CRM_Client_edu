<template>
  <ModalLayout :IsOpen="IsOpenModalCreateClient" @close="$emit('closeModalCreateClient')">
    <template #header>
      <span>Новый клиент</span>
    </template>
    <form>
      <div class="Input-item">
        <label> Фамилия </label>
        <input type="text" v-model="newClientInputs.surname" />
      </div>
      <div class="Input-item">
        <label> Имя </label>
        <input type="text" v-model="newClientInputs.name" />
      </div>
      <div class="Input-item">
        <label> Отчество </label>
        <input type="text" v-model="newClientInputs.patronymic" />
      </div>
      <div class="Input-item">
        <label> Номер телефона </label>
        <input type="tel" v-model="newClientInputs.phone" />
      </div>
      <div class="Input-item">
        <label> Почта </label>
        <input type="email" v-model="newClientInputs.email" />
      </div>
      <div class="Input-item">
        <label> Часовой пояс </label>
        <input type="text" v-model="newClientInputs.timezone" />
      </div>
      <div class="Input-item">
        <label> Цвет </label>
        <input type="color" v-model="newClientInputs.hex" />
      </div>
      <div class="Input-item">
        <label> Дата рождения </label>
        <input type="date" v-model="newClientInputs.birthDate" />
      </div>
      <div class="Input-item">
        <label> Класс </label>
        <input type="number" v-model="newClientInputs.grade" />
      </div>
      <div class="Input-item">
        <label> Баланс </label>
        <input type="number" v-model="newClientInputs.balance" />
      </div>
      <button type="submit">Создать</button>
    </form>
  </ModalLayout>
</template>

<script setup>
import { ref } from 'vue'
import ModalLayout from './ModalLayout.vue'

const emit = defineEmits(['closeModalCreateClient'])

const props = defineProps({
  IsOpenModalCreateClient: {
    type: Boolean,
  },
})

const newClientInputs = ref({
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
})

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

.Input-item input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 2px solid #802e87;
  border-radius: 17px;
  background-color: #f5f5f5;
  outline: none;
  transition: border-color 0.3s;
}

.Input-item input:focus {
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
