<template>
  <PageLayout>
    <UiPageHeader title="Отчеты" subtitle="Баланс клиентов и назначенные предметы с тарифами" />

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
    </div>

    <UiCardList
      :is-empty="filteredCards.length === 0"
      empty-text="Нет клиентов для отображения"
      max-height="calc(100vh - 260px)"
    >
      <UiCardShell
        v-for="card in filteredCards"
        :key="card.id"
        :background-color="card.color"
        class="report-card"
      >
        <div class="report-main">
          <div class="report-head">
            <div class="report-name">
              {{ card.fullName }}
            </div>
            <div class="report-timezone">UTC{{ card.timezone }}</div>
          </div>

          <div class="report-meta">
            <span>Баланс: {{ card.balance }} ₽</span>
            <span>Статус: {{ statusLabels[card.status] || card.status }}</span>
          </div>

          <div class="report-subjects">
            <div class="report-subjects-title">Предметы / тарифы</div>

            <div v-if="card.items.length" class="report-subject-list">
              <div v-for="item in card.items" :key="item.id" class="report-subject-item">
                {{ item.position }}. {{ item.subjectTitle }} — {{ item.tariffTitle }}
              </div>
            </div>

            <div v-else class="report-empty-subjects">Предметы и тарифы пока не назначены</div>
          </div>
        </div>

        <div v-if="canManageReports" class="report-actions">
          <button class="icon-btn" @click="openEditModal(card)">
            <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
          </button>
        </div>
      </UiCardShell>
    </UiCardList>

    <ModalEditReport
      :isOpenModalEditReport="isOpenModalEditReport"
      :clientData="selectedClient"
      :reportItems="selectedReportItems"
      @closeModalEditReport="closeEditModal"
      @saveReport="saveReport"
    />
  </PageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'
import UiPageHeader from '@/components/ui/UiPageHeader.vue'
import UiCardList from '@/components/ui/UiCardList.vue'
import UiCardShell from '@/components/ui/UiCardShell.vue'
import ModalEditReport from '@/components/ModalEditReport.vue'

import { useAuthStore } from '@/stores/auth'
import { useClientsStore } from '@/stores/clients'
import { useFinancesStore } from '@/stores/finances'
import { useReportsStore } from '@/stores/reports'
import { useSubjectsStore } from '@/stores/subjects'

const authStore = useAuthStore()
const clientsStore = useClientsStore()
const financesStore = useFinancesStore()
const reportsStore = useReportsStore()
const subjectsStore = useSubjectsStore()

const { clients } = storeToRefs(clientsStore)
const { tariffs } = storeToRefs(financesStore)
const { clientTariffs } = storeToRefs(reportsStore)
const { subjects } = storeToRefs(subjectsStore)

const searchQuery = ref('')
const isOpenModalEditReport = ref(false)
const selectedClient = ref(null)
const selectedReportItems = ref([])

const statusLabels = {
  active: 'занимается',
  inactive: 'не занимается',
}

const canManageReports = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager'
})

const tariffsMap = computed(() => {
  return tariffs.value.reduce((acc, tariff) => {
    acc[tariff.id] = tariff
    return acc
  }, {})
})

const subjectsMap = computed(() => {
  return subjects.value.reduce((acc, subject) => {
    acc[subject.id] = subject
    return acc
  }, {})
})

const reportCards = computed(() => {
  return clients.value.map((client) => {
    const items = clientTariffs.value
      .filter((item) => item.clientId === client.id)
      .sort((a, b) => a.position - b.position)
      .map((item) => ({
        ...item,
        subjectTitle: subjectsMap.value[item.subjectId]?.name?.trim() || 'Предмет не найден',
        tariffTitle: tariffsMap.value[item.tariffId]?.title || 'Тариф не найден',
      }))

    return {
      ...client,
      fullName: [client.surname, client.name, client.patronymic].filter(Boolean).join(' '),
      items,
    }
  })
})

const filteredCards = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return reportCards.value

  return reportCards.value.filter((card) => card.fullName.toLowerCase().includes(query))
})

function openEditModal(card) {
  selectedClient.value = { ...card }
  selectedReportItems.value = card.items.map((item) => ({
    id: item.id,
    subjectId: item.subjectId,
    tariffId: item.tariffId,
  }))
  isOpenModalEditReport.value = true
}

function closeEditModal() {
  isOpenModalEditReport.value = false
  selectedClient.value = null
  selectedReportItems.value = []
}

function saveReport(payload) {
  clientsStore.updateClient({
    id: payload.clientId,
    balance: Number(payload.balance),
  })

  reportsStore.replaceClientTariffsForClient({
    clientId: payload.clientId,
    organizationId: payload.organizationId ?? 0,
    items: payload.items,
  })

  closeEditModal()
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 460px;
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

.report-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 20px;
  min-height: 132px;
}

.report-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-head {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.report-name {
  min-width: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text);
}

.report-timezone {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 6px 10px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.45);
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.report-subjects {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-subjects-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text-muted);
}

.report-subject-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.report-subject-item {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.report-empty-subjects {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.report-actions {
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
