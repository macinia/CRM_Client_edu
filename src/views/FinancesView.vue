<template>
  <PageLayout>
    <div class="finances-top">
      <h1>Финансы</h1>
      <button @click="openModalCreateEmployer">
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        {{ titleAdd }}
      </button>
    </div>

    <div class="finances-employes">
      <div class="finances-employes-nav">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="selectSection(section.id)"
          :class="['nav-item', { selected: activeSection === section.id }]"
        >
          {{ section.title }} ({{ section.count }})
        </button>
      </div>

      <div class="user-list-container">
        <div
          v-for="item in selectedArray"
          :key="item.id"
          :style="{ backgroundColor: item.hex }"
          class="user-card"
        >
          <div class="card-info">
            <div class="info-top">
              <p class="fio">{{ item.surname }} {{ item.name }} {{ item.patronymic }}</p>
              (UTC{{ item.timezone }})
            </div>
            <div class="info-bottom">{{ item.phone }} {{ item.email }}</div>
          </div>
          <div class="card-name">
            {{ item.name }}
          </div>
          <div class="card-action">
            <button>
              <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalCreateEmployer
      :is-open="isOpenModalCreateEmployer"
      @close="handleModalClose"
      @submit="refreshData"
    />
  </PageLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import PageLayout from '@/components/PageLayout.vue'
import ModalCreateEmployer from '@/components/ModalCreateEmployer.vue'
import { useTarifStore } from '@/stores/tarif'
import { useStavkaStore } from '@/stores/stavka'
// import { useSalaryStore } from '@/stores/salary'

const titleAdd = ref('Добавить сотрудника')

const tarifStore = useTarifStore()
const stavkaStore = useStavkaStore()
// const salaryStore = useSalaryStore()

const tarifs = ref([])
const stavkas = ref([])
const salaries = ref([])

const activeSection = ref('tarif')
const isOpenModalCreateEmployer = ref(false)

const sections = computed(() => [
  { id: 'tarif', title: 'Тарифы', count: tarifs.value.length },
  { id: 'stavka', title: 'Ставки', count: stavkas.value.length },
  { id: 'salary', title: 'Зарплаты', count: salaries.value.length },
])

const selectedArray = computed(() => {
  switch (activeSection.value) {
    case 'tarif':
      return tarifs.value
    case 'stavka':
      return stavkas.value
    case 'salary':
      return salaries.value
    default:
      return []
  }
})

const selectSection = (sectionId) => {
  activeSection.value = sectionId
}

const openModalCreateEmployer = () => {
  isOpenModalCreateEmployer.value = true
}

const handleModalClose = () => {
  isOpenModalCreateEmployer.value = false
}

const refreshData = async () => {
  tarifs.value = await tarifStore.getTarifs()
  stavkas.value = await stavkaStore.getStavkas()
  salaries.value = []
}

onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.finances-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #6e6565;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.finances-top button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #b49db4;
  border-radius: 28px;
  padding: 8px 24px;
  font-size: 1.1rem;
  transition: background-color 0.2s;
}

.finances-top button:hover {
  background-color: #9c869c;
}

.finances-employes-nav {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #6e6565;
  margin-bottom: 20px;
}

.nav-item {
  padding: 12px 0;
  font-size: 1.1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item.selected {
  color: #802e87;
  border-bottom: 3px solid #802e87;
  font-weight: 600;
}

.user-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.info-top {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.fio {
  font-weight: 600;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-bottom {
  font-size: 0.9rem;
  color: #666;
}

.edit-icon {
  width: 24px;
  height: 24px;
  transition: opacity 0.2s;
}

.edit-icon:hover {
  opacity: 0.7;
}

.plus-icon {
  width: 20px;
  height: 20px;
}
</style>
