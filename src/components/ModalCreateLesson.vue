<template>
  <ModalLayout :IsOpen="isOpenModalCreateLesson" @close="$emit('closeModalCreateLesson')">
    <template #header>
      <span>Создать занятие </span>
    </template>
    <form @submit.prevent="createLesson()">
      <div class="Input-item">
        <label for=""> Предмет </label>
        <select v-model="newLessonInputs.subject">
          <option value="">Выберите предмет</option>
          <option v-for="subject in SubjectList" :key="subject.id">{{ subject.name }}</option>
        </select>
      </div>
      <div class="Input-item">
        <label for=""> ФИО ученика </label>
        <select v-model="newLessonInputs.client">
          <option value="">Выберите ученика</option>
          <option v-for="client in ClientList" :key="client.id">
            {{ `${client.surname} ${client.name} ${client.patronymic}` }}
          </option>
        </select>
      </div>
      <div class="Input-item">
        <label for=""> Тариф ученика </label>
        <select v-model="newLessonInputs.tarif">
          <option value="">Выберите тариф</option>
          <option v-for="tarif in TarifList" :key="tarif.id">{{ tarif.name }}</option>
        </select>
      </div>
      <div class="Input-item">
        <label for=""> ФИО преподавателя </label>
        <select v-model="newLessonInputs.teacher">
          <option value="">Выберите преподавателя</option>
          <option v-for="teacher in TeacherList" :key="teacher.id">
            {{ teacher.user.surname }} {{ teacher.user.name }} {{ teacher.user.patronymic }}
          </option>
        </select>
      </div>
      <div class="Input-item">
        <label for=""> Ставка преподавателя </label>
        <select v-model="newLessonInputs.stavka">
          <option value="">Выберите ставку</option>
          <option v-for="stavka in StavkaList" :key="stavka.id">{{ stavka.name }}</option>
        </select>
      </div>
      <div class="Input-item">
        <label for=""> Время занятий </label>
        <div v-for="day in newLessonInputs.weekLessons" :key="day">
          <select v-model="day.dayOfWeek">
            <option value="">Выберите недели</option>
            <option
              v-for="weekday in [
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Cуббота',
                'Воскресенье',
              ]"
              :key="weekday"
            >
              {{ weekday }}
            </option>
          </select>
          <input v-model="day.startTime" type="time" />
          <input v-model="day.endTime" type="time" />
        </div>
        <button @click.prevent="newLessonInputs.weekLessons.push({})">+</button>
      </div>
      {{ newLessonInputs.weekLessons }}

      <button>Создать</button>
    </form>
  </ModalLayout>
</template>

<script setup>
import ModalLayout from './ModalLayout.vue'
import { ref } from 'vue'
import { useLessonsStore } from '@/stores/lessons'
import { useSubjectStore } from '@/stores/subjects'
import { onMounted } from 'vue'
import { useClientsStore } from '@/stores/clients'
import { useTarifStore } from '@/stores/tarif'
import { useEmployersStore } from '@/stores/employers'
import { useStavkaStore } from '@/stores/stavka'

const SubjectStore = useSubjectStore()
const ClientsStore = useClientsStore()
const TarifStore = useTarifStore()
const TeacherStore = useEmployersStore()
const StavkaStore = useStavkaStore()
const emit = defineEmits(['closeModalCreateLesson'])
const LessonsStore = useLessonsStore()
const SubjectList = ref([])
const ClientList = ref([])
const TarifList = ref([])
const StavkaList = ref([])
const TeacherList = ref([])

const props = defineProps({
  isOpenModalCreateLesson: {
    type: Boolean,
  },
})

const newLessonInputs = ref({
  subject: {},
  client: {},
  tarif: {},
  teacher: {},
  stavka: {},
  weekLessons: [{}],
})

const createLesson = () => {
  let newLesson = {
    user: newLessonInputs.value.user,
    notes: newLessonInputs.value.notes,
    subjects: newLessonInputs.value.subjects,
  }
  LessonsStore.createLesson(newLesson)
  emit('closeModalCreateLesson')
}

onMounted(async () => {
  SubjectList.value = await SubjectStore.getSubjects()
  ClientList.value = await ClientsStore.getClients()
  TarifList.value = await TarifStore.getTarifs()
  TeacherList.value = await TeacherStore.getTeachers()
  StavkaList.value = await StavkaStore.getStavkas()
})
</script>

<style scoped>
.Input-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.Input-item label {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

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
