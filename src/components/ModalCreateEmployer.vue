<template>
  <ModalLayout :IsOpen="IsOpenModalCreateEmployer" @close="$emit('closeModalCreateEmployer')">
    <template #header>
      <span>Новый сотрудник</span>
    </template>
    <form @submit.prevent="createEmployer()">
      <div class="Input-item">
        <label for=""> Фамилия </label>
        <input type="text" v-model="newEmployerInputs.user.surname" />
      </div>
      <div class="Input-item">
        <label for=""> Имя </label>
        <input type="text" v-model="newEmployerInputs.user.name" />
      </div>
      <div class="Input-item">
        <label for=""> Отчество </label>
        <input type="text" v-model="newEmployerInputs.user.patronymic" />
      </div>
      <div class="Input-item">
        <label for=""> Номер телефон </label>
        <input type="tel" v-model="newEmployerInputs.user.phone" />
      </div>
      <div class="Input-item">
        <label for=""> Почта </label>
        <input type="email" v-model="newEmployerInputs.user.email" />
      </div>
      <div class="Input-item">
        <label for=""> Часовый Пояс </label>
        <input type="text" v-model="newEmployerInputs.user.timezone" />
      </div>
      <div class="Input-item">
        <label for=""> Цвет </label>
        <input type="color" v-model="newEmployerInputs.user.hex" />
      </div>

      <div class="Input-item">
        <label for=""> Роль в системе </label>
        <select v-model="newEmployerInputs.user.role">
          <option value="">Выберите роль</option>
          <option value="Администратор">Администратор</option>
          <option value="Менеджер">Менеджер</option>
          <option value="Преподаватель">Преподаватель</option>
        </select>
      </div>
      <div  v-if="newEmployerInputs.user.role == 'Преподаватель' "
      class="subjects-block">
        <div  v-for="(subject, index) in newEmployerInputs.subjects" :key="index"  class="Input-item">
        <label for=""> Предмет </label>
        <input type="text" v-model="newEmployerInputs.subjects[index]" />
      </div>
      </div>
      <div class="Input-item">
        <label for=""> Пароль </label>
        <input type="password" v-model="newEmployerInputs.user.password" />
      </div>

      <div class="Input-item">
        <label for=""> Примечания </label>
        <textarea v-model="newEmployerInputs.notes" />
      </div>
      <button>Создать</button>
    </form>
  </ModalLayout>
</template>

<script setup>
import { ref } from 'vue'
import ModalLayout from './ModalLayout.vue'
import { useEmployersStore } from '@/stores/employers'

const emit = defineEmits(['closeModalCreateEmployer'])
const EmployersStore = useEmployersStore()

const props = defineProps({
  IsOpenModalCreateEmployer: {
    type: Boolean,
  },
})

const newEmployerInputs = ref({
  user: {
    surname: '',
    name: '',
    patronymic: '',
    email: '',
    phone: '',
    timezone: '',
    role: '',
    hex: '',
    password: '',
  },
  subjects: ["" ],
  notes: '',
})

const createEmployer = () => {
  let newEmployer = {
    user: newEmployerInputs.value.user,
    notes: newEmployerInputs.value.notes,
    subjects: newEmployerInputs.value.subjects,
  }
  console.log(newEmployer);

  EmployersStore.createEmployer(newEmployer)
  emit("closeModalCreateEmployer")
}


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
.Input-item select,
.Input-item textarea {
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
.Input-item select:focus,
.Input-item textarea:focus {
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
