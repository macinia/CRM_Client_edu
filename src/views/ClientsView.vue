<template>
  <PageLayout>
    <div class="clients-top">
      <h1>Наши клиенты</h1>
      <button @click="openModalCreateClient()">
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        Клиент
      </button>
    </div>
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Введите ФИО клиента"
          class="search-input"
        />
        <img src="@/assets/search.svg" class="search-icon" />
      </div>
      <button>фильтр по балансу</button>
    </div>
    <div class="clients-list">
      {{ clients }}
    </div>
    <ModalCreateClient
      :IsOpenModalCreateClient="isOpenModalCreateClient"
      @closeModalCreateClient="closeModalCreateClient"
    />
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
import ModalCreateClient from '@/components/ModalCreateClient.vue'
import { ref } from 'vue'

const isOpenModalCreateClient = ref(false)

const closeModalCreateClient = () => {
  isOpenModalCreateClient.value = false
}

const openModalCreateClient = () => {
  isOpenModalCreateClient.value = true
}

const searchQuery = ref('')
const clients = [
  {
    name: 'Губанова Елена Борисовна',
    phone: '099e82908302893',
    email: 'rsk@mail.ru',
    class: '11',
    time: 'UTC +3',
    balance: ' 3450',
    status: 'занимается',
  },
  {
    name: 'Фролова Кристина Ивановна',
    phone: '099e82908302893',
    email: 'rsk@mail.ru',
    class: '9',
    time: 'UTC +3',
    balance: ' 3450',
    status: 'занимается',
  },
]
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
}
.search-container {
  padding: 8px 24px;
  font-size: 24px;
  border-bottom: 1px solid #6e6565;
  display: flex;
  padding: 12px 8px 8px 4px;
  justify-content: space-between;
}
.search-input-wrapper {
  position: relative;
  display: flex;
}
.search-container button {
  background-color: #b49db4;
  border-radius: 56px;
  padding: 8px 24px;
  font-size: 24px;
}

.search-input {
  width: 520px;
  height: 48px;
  padding: 10px 15px;
  font-size: 24px;
  border: 1px solid #802e87;
  border-radius: 16px;
  outline: none;
  padding-right: 40px;
}

.search-input:focus {
  border: 2px solid #802e87;
}
.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  pointer-events: none;
}

.plus-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding-top: 4px;
}
</style>
