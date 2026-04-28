<template>
  <PageLayout>
    <UiPageHeader
      title="Наши клиенты"
      :action-visible="canManageClients"
      action-label="Клиент"
      @action="openModalCreateClient"
    />

    <div class="toolbar">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Укажите ФИО клиента"
          class="search-input"
        />
        <img src="@/assets/search.svg" alt="search" class="search-icon" />
      </div>

      <button class="filter-btn" :class="{ active: isSortedByBalance }" @click="toggleBalanceSort">
        Фильтр по балансу
      </button>
    </div>

    <UiCardList
      :is-empty="filteredClients.length === 0"
      empty-text="Нет клиентов"
      max-height="calc(100vh - 320px)"
    >
      <UiCardShell
        v-for="client in filteredClients"
        :key="client.id"
        :background-color="client.color"
        class="client-card"
      >
        <div class="client-main">
          <div class="client-head">
            <p class="client-name">
              {{ getClientFullName(client) }}
            </p>
            <span class="client-timezone">UTC{{ client.timezone }}</span>
          </div>

          <div class="client-contacts">
            <span>{{ client.phone || 'Телефон не указан' }}</span>
            <span>{{ client.email || 'Email не указан' }}</span>
          </div>
        </div>

        <div class="client-meta">
          <div class="meta-item">
            <span class="meta-label">Класс</span>
            <span class="meta-value">{{ client.grade }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Баланс</span>
            <span class="meta-value">{{ client.balance }}</span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Статус</span>
            <span class="meta-value">{{ statusLabels[client.status] || client.status }}</span>
          </div>
        </div>

        <div v-if="canManageClients" class="client-actions">
          <button class="icon-btn" @click="openModalEditClient(client)">
            <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
          </button>
        </div>
      </UiCardShell>
    </UiCardList>

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

import UiPageHeader from '@/components/ui/UiPageHeader.vue'
import UiCardList from '@/components/ui/UiCardList.vue'
import UiCardShell from '@/components/ui/UiCardShell.vue'

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
  return [client.surname, client.name, client.patronymic].filter(Boolean).join(' ')
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
.toolbar {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 480px;
}

.search-input {
  width: 100%;
  min-height: 48px;
  padding: 0 44px 0 16px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(128, 46, 135, 0.08);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  opacity: 0.65;
  pointer-events: none;
}

.filter-btn {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    border-color var(--transition-base);
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background-color: var(--color-primary-soft);
  border-color: rgba(128, 46, 135, 0.18);
  color: var(--color-primary);
}

.client-card {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(240px, 0.9fr) auto;
  align-items: center;
  gap: 20px;
  min-height: 116px;
}

.client-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.client-head {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.client-name {
  min-width: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.client-timezone {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 6px 10px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.45);
}

.client-contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.client-meta {
  display: grid;
  gap: 10px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.meta-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.client-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.45);
  transition:
    background-color var(--transition-base),
    transform var(--transition-base);
}

.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.72);
  transform: translateY(-1px);
}

.edit-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
