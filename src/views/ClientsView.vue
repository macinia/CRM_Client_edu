<template>
  <PageLayout>
    <div class="clients-top">
      <h1>Наши клиенты</h1>

      <button v-if="canManageClients" @click="openModalCreateClient">
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        Клиент
      </button>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Укажите ФИО клиента"
          class="search-input"
        />
        <img src="@/assets/search.svg" class="search-icon" />
      </div>

      <button class="filterButton" @click="toggleBalanceSort">Фильтр по балансу</button>
    </div>

    <div class="clients-section">
      <div v-if="filteredClients.length" class="client-list-container">
        <div
          v-for="client in filteredClients"
          :key="client.id"
          class="client-card"
          :style="{ backgroundColor: client.color }"
        >
          <div class="card-info">
            <div class="info-top">
              <p class="fio">
                {{ getClientFullName(client) }}
              </p>
              <span>(UTC{{ client.timezone }})</span>
            </div>

            <div class="info-buttom">{{ client.phone }} {{ client.email }}</div>
          </div>

          <div class="card-client-info">
            <div>Класс: {{ client.grade }}</div>
            <div>Баланс: {{ client.balance }}</div>
            <div>Статус: {{ statusLabels[client.status] || client.status }}</div>
          </div>

          <div class="card-action">
            <button v-if="canManageClients" @click="openModalEditClient(client)">
              <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-clients">Нет клиентов</div>
    </div>

    <ModalCreateClient
      :IsOpenModalCreateClient="isOpenModalCreateClient"
      @closeModalCreateClient="closeModalCreateClient"
      @addClient="addClient"
    />

    <ModalEditClient
      :IsOpenModalEditClient="isOpenModalEditClient"
      :clientData="editClient"
      @closeModalEditClient="closeModalEditClient"
      @saveClient="saveClient"
    />
  </PageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'
import ModalCreateClient from '@/components/ModalCreateClient.vue'
import ModalEditClient from '@/components/ModalEditClient.vue'

import { useClientsStore } from '@/stores/clients'
import { useAuthStore } from '@/stores/auth'

const clientsStore = useClientsStore()
const authStore = useAuthStore()

const { clients } = storeToRefs(clientsStore)

const isOpenModalCreateClient = ref(false)
const isOpenModalEditClient = ref(false)
const searchQuery = ref('')
const isSortedByBalance = ref(false)
const editClient = ref(null)

const statusLabels = {
  active: 'занимается',
  inactive: 'не занимается',
}

const canManageClients = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager'
})

const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredClients = computed(() => {
  let result = [...clients.value]

  if (normalizedSearchQuery.value) {
    result = result.filter((client) =>
      getClientFullName(client).toLowerCase().includes(normalizedSearchQuery.value),
    )
  }

  if (isSortedByBalance.value) {
    result.sort((a, b) => a.balance - b.balance)
  }

  return result
})

function getClientFullName(client) {
  return `${client.surname} ${client.name} ${client.patronymic}`.trim()
}

function openModalCreateClient() {
  isOpenModalCreateClient.value = true
}

function closeModalCreateClient() {
  isOpenModalCreateClient.value = false
}

function openModalEditClient(client) {
  editClient.value = { ...client }
  isOpenModalEditClient.value = true
}

function closeModalEditClient() {
  isOpenModalEditClient.value = false
  editClient.value = null
}

function addClient(newClient) {
  clientsStore.createClient(newClient)
  closeModalCreateClient()
}

function saveClient(client) {
  clientsStore.updateClient(client)
  closeModalEditClient()
}

function toggleBalanceSort() {
  isSortedByBalance.value = !isSortedByBalance.value
}
</script>

<style scoped>
.clients-top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #6e6565;
  padding-bottom: 8px;
}

.clients-top button {
  background-color: #b49db4;
  border-radius: 56px;
  padding: 8px 24px;
  font-size: 24px;
  align-items: center;
  gap: 8px;
}

.plus-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding-top: 4px;
}

.clients-section {
  margin-top: 16px;
}

.client-card {
  height: 130px;
  gap: 8px;
  display: flex;
  padding: 16px 32px;
  border-radius: 30px;
  flex-shrink: 0;
}

.client-list-container {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-height: 600px;
  overflow-y: auto;
}

.card-info {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-top {
  font-weight: 600;
  font-size: 26px;
  display: flex;
  gap: 8px;
}

.fio {
  max-width: 400px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.info-buttom {
  font-weight: 450;
  font-size: 24px;
}

.card-client-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  width: 100%;
  margin-left: 160px;
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.edit-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-self: center;
}

.no-clients {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #888;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  border-bottom: 1px solid #6e6565;
  padding-bottom: 8px;
  position: relative;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  border-radius: 17px;
  padding: 5px;
}

.search-input {
  font-size: 24px;
  border: 1px solid #802e87;
  border-radius: 16px;
  outline: none;
  width: 480px;
  background-color: transparent;
  padding: 10px 50px 10px 15px;
}

.search-icon {
  width: 26px;
  height: 26px;
  position: absolute;
  left: 440px;
}

.filterButton {
  background-color: #b49db4;
  border-radius: 56px;
  padding: 8px 24px;
  font-size: 24px;
  align-items: center;
  gap: 8px;
}
</style>
