<template>
  <PageLayout>
    <UiPageHeader
      title="Финансы"
      :action-visible="showAddButton"
      :action-label="addButtonTitle"
      @action="openCreateModal"
    />

    <UiTabs v-model="activeSection" :items="tabItems" />

    <UiCardList
      :is-empty="activeCards.length === 0"
      :empty-text="emptyText"
      max-height="calc(100vh - 280px)"
    >
      <UiCardShell
        v-for="card in activeCards"
        :key="card.id"
        :background-color="card.color"
        class="finance-card"
      >
        <div class="card-main">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-subtitle">{{ card.subtitle }}</div>
        </div>

        <div class="card-meta">
          <div v-for="metaItem in card.meta" :key="metaItem.label" class="meta-item">
            <span class="meta-label">{{ metaItem.label }}</span>
            <span class="meta-value">{{ metaItem.value }}</span>
          </div>
        </div>

        <div v-if="canShowEditButton(card)" class="card-actions">
          <button class="icon-btn" @click="handleEditCard(card)">
            <img src="@/assets/edit.svg" alt="edit" class="edit-icon" />
          </button>
        </div>
      </UiCardShell>
    </UiCardList>

    <ModalCreateTeacherRate
      :isOpenModalCreateTeacherRate="isCreateTeacherRateModalOpen"
      @closeModalCreateTeacherRate="closeCreateTeacherRateModal"
    />

    <ModalEditTeacherRate
      :isOpenModalEditTeacherRate="isEditTeacherRateModalOpen"
      :teacherRateData="selectedTeacherRate"
      @closeModalEditTeacherRate="closeEditTeacherRateModal"
      @saveTeacherRate="saveTeacherRate"
    />

    <ModalCreateTariff
      :isOpenModalCreateTariff="isCreateTariffModalOpen"
      @closeModalCreateTariff="closeCreateTariffModal"
    />

    <ModalEditTariff
      :isOpenModalEditTariff="isEditTariffModalOpen"
      :tariffData="selectedTariff"
      @closeModalEditTariff="closeEditTariffModal"
      @saveTariff="saveTariff"
    />

    <ModalEditSalary
      :isOpenModalEditSalary="isEditSalaryModalOpen"
      :salaryData="selectedSalary"
      @closeModalEditSalary="closeEditSalaryModal"
      @saveSalaryRecord="saveSalaryRecord"
    />
  </PageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'

import UiPageHeader from '@/components/ui/UiPageHeader.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiCardList from '@/components/ui/UiCardList.vue'
import UiCardShell from '@/components/ui/UiCardShell.vue'

import ModalCreateTeacherRate from '@/components/ModalCreateTeacherRate.vue'
import ModalEditTeacherRate from '@/components/ModalEditTeacherRate.vue'
import ModalCreateTariff from '@/components/ModalCreateTariff.vue'
import ModalEditTariff from '@/components/ModalEditTariff.vue'
import ModalEditSalary from '@/components/ModalEditSalary.vue'

import { useAuthStore } from '@/stores/auth'
import { useFinancesStore } from '@/stores/finances'
import { useEmployersStore } from '@/stores/employers'
import { useLessonsStore } from '@/stores/lessons'
import { useSubjectsStore } from '@/stores/subjects'

const authStore = useAuthStore()
const financesStore = useFinancesStore()
const employersStore = useEmployersStore()
const lessonsStore = useLessonsStore()
const subjectsStore = useSubjectsStore()

const { tariffs, teacherRates, salaryRecords } = storeToRefs(financesStore)
const { employers } = storeToRefs(employersStore)
const { lessons } = storeToRefs(lessonsStore)
const { subjects } = storeToRefs(subjectsStore)

const activeSection = ref('tariffs')

const isCreateTeacherRateModalOpen = ref(false)
const isEditTeacherRateModalOpen = ref(false)
const selectedTeacherRate = ref(null)

const isCreateTariffModalOpen = ref(false)
const isEditTariffModalOpen = ref(false)
const selectedTariff = ref(null)

const isEditSalaryModalOpen = ref(false)
const selectedSalary = ref(null)

const canManageFinances = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager'
})

const showAddButton = computed(() => {
  if (!canManageFinances.value) return false
  return activeSection.value === 'tariffs' || activeSection.value === 'rates'
})

const addButtonTitle = computed(() => {
  if (activeSection.value === 'tariffs') return 'Тариф'
  if (activeSection.value === 'rates') return 'Ставку'
  return ''
})

const teachersMap = computed(() => {
  return employers.value.reduce((acc, employer) => {
    acc[employer.id] = employer
    return acc
  }, {})
})

const teacherList = computed(() => {
  return employers.value.filter((employer) => employer.role === 'teacher')
})

const subjectsMap = computed(() => {
  return subjects.value.reduce((acc, subject) => {
    acc[subject.id] = subject
    return acc
  }, {})
})

const subjectIdByName = computed(() => {
  return subjects.value.reduce((acc, subject) => {
    acc[subject.name.trim().toLowerCase()] = subject.id
    return acc
  }, {})
})

const salaryRecordsMap = computed(() => {
  return salaryRecords.value.reduce((acc, record) => {
    acc[record.teacherId] = record
    return acc
  }, {})
})

const todayKey = computed(() => {
  const date = new Date()
  return toDateKey(date)
})

const teacherRateCards = computed(() => {
  return teacherRates.value.map((rate) => {
    const subject = subjectsMap.value[rate.subjectId]

    return {
      ...rate,
      subjectTitle: subject ? subject.name.trim() : 'Предмет не найден',
    }
  })
})

const salaryCards = computed(() => {
  return teacherList.value.map((teacher) => {
    const salaryRecord = salaryRecordsMap.value[teacher.id] || null
    const lastPaymentDate = salaryRecord?.lastPaymentDate || getDefaultLastPaymentDate()
    const lastPaymentAmount = salaryRecord?.lastPaymentAmount ?? 0
    const periodEnd = todayKey.value

    const lessonsInPeriod = lessons.value.filter((lesson) => {
      if (lesson.teacherId !== teacher.id) return false
      if (lesson.status === 'cancelled') return false

      const lessonStart = new Date(lesson.startAt)
      const periodStartDate = new Date(`${lastPaymentDate}T00:00:00`)
      const periodEndDate = new Date(`${periodEnd}T23:59:59`)

      return lessonStart >= periodStartDate && lessonStart <= periodEndDate
    })
    const totalMinutes = lessonsInPeriod.reduce((sum, lesson) => {
      return sum + getLessonDurationMinutes(lesson)
    }, 0)

    const totalAmount = lessonsInPeriod.reduce((sum, lesson) => {
      const lessonDurationMinutes = getLessonDurationMinutes(lesson)
      const lessonSubjectId = subjectIdByName.value[lesson.subject?.trim().toLowerCase()]

      const matchedRate = teacherRates.value.find((rate) => {
        return (
          rate.subjectId === lessonSubjectId && rate.lessonDurationMinutes === lessonDurationMinutes
        )
      })

      return sum + (matchedRate ? matchedRate.rate : 0)
    }, 0)

    return {
      id: teacher.id,
      entityType: 'salary',
      teacherId: teacher.id,
      teacherName: getPersonFullName(teacher),
      lastPaymentDate,
      lastPaymentAmount,
      periodStart: lastPaymentDate,
      periodEnd,
      periodLabel: `${formatDate(lastPaymentDate)} — ${formatDate(periodEnd)}`,
      lessonsCount: lessonsInPeriod.length,
      totalMinutes,
      totalAmount,
      organizationId: teacher.organizationId ?? 0,
      color: salaryRecord?.color || '#E8E3FA',
    }
  })
})

const tabItems = computed(() => [
  { value: 'tariffs', label: 'Тарифы', count: tariffs.value.length },
  { value: 'rates', label: 'Ставки', count: teacherRateCards.value.length },
  { value: 'salaries', label: 'Зарплаты', count: salaryCards.value.length },
])

const tariffDisplayCards = computed(() => {
  return tariffs.value.map((tariff) => ({
    id: tariff.id,
    entityType: 'tariff',
    color: tariff.color,
    title: tariff.title,
    subtitle: getFormatLabel(tariff.format),
    meta: [
      { label: 'Длительность', value: `${tariff.lessonDurationMinutes} мин` },
      { label: 'Количество занятий', value: tariff.lessonsCount },
      { label: 'Стоимость', value: `${tariff.price} ₽` },
    ],
  }))
})

const rateDisplayCards = computed(() => {
  return teacherRateCards.value.map((rate) => ({
    id: rate.id,
    entityType: 'rate',
    color: rate.color,
    title: rate.subjectTitle,
    subtitle: getTeacherLevelLabel(rate.teacherLevel),
    meta: [
      { label: 'Длительность', value: `${rate.lessonDurationMinutes} мин` },
      { label: 'Ставка', value: `${rate.rate} ₽` },
    ],
  }))
})

const salaryDisplayCards = computed(() => {
  return salaryCards.value.map((salary) => ({
    id: salary.id,
    entityType: 'salary',
    color: salary.color,
    title: salary.teacherName,
    subtitle: salary.periodLabel,
    teacherId: salary.teacherId,
    teacherName: salary.teacherName,
    lastPaymentDate: salary.lastPaymentDate,
    lastPaymentAmount: salary.lastPaymentAmount,
    organizationId: salary.organizationId,
    meta: [
      { label: 'Последняя выплата', value: `${salary.lastPaymentAmount} ₽` },
      { label: 'Проведено занятий', value: salary.lessonsCount },
    ],
  }))
})

const activeCards = computed(() => {
  if (activeSection.value === 'tariffs') return tariffDisplayCards.value
  if (activeSection.value === 'rates') return rateDisplayCards.value
  return salaryDisplayCards.value
})

const emptyText = computed(() => {
  if (activeSection.value === 'tariffs') return 'Тарифов пока нет'
  if (activeSection.value === 'rates') return 'Ставок пока нет'
  return 'Преподавателей для расчёта зарплаты пока нет'
})

function openCreateModal() {
  if (activeSection.value === 'tariffs') {
    isCreateTariffModalOpen.value = true
  }

  if (activeSection.value === 'rates') {
    isCreateTeacherRateModalOpen.value = true
  }
}

function closeCreateTeacherRateModal() {
  isCreateTeacherRateModalOpen.value = false
}

function openEditTeacherRateModal(rateId) {
  const rate = teacherRates.value.find((item) => item.id === rateId)
  if (!rate) return

  selectedTeacherRate.value = { ...rate }
  isEditTeacherRateModalOpen.value = true
}

function closeEditTeacherRateModal() {
  isEditTeacherRateModalOpen.value = false
  selectedTeacherRate.value = null
}

function saveTeacherRate(updatedRate) {
  financesStore.updateTeacherRate(updatedRate)
  closeEditTeacherRateModal()
}

function closeCreateTariffModal() {
  isCreateTariffModalOpen.value = false
}

function openEditTariffModal(tariffId) {
  const tariff = tariffs.value.find((item) => item.id === tariffId)
  if (!tariff) return

  selectedTariff.value = { ...tariff }
  isEditTariffModalOpen.value = true
}

function closeEditTariffModal() {
  isEditTariffModalOpen.value = false
  selectedTariff.value = null
}

function saveTariff(updatedTariff) {
  financesStore.updateTariff(updatedTariff)
  closeEditTariffModal()
}

function openEditSalaryModal(card) {
  selectedSalary.value = {
    teacherId: card.teacherId,
    teacherName: card.teacherName,
    periodLabel: card.subtitle,
    lastPaymentDate: card.lastPaymentDate,
    lastPaymentAmount: card.lastPaymentAmount,
    organizationId: card.organizationId,
    color: card.color,
  }
  isEditSalaryModalOpen.value = true
}

function closeEditSalaryModal() {
  isEditSalaryModalOpen.value = false
  selectedSalary.value = null
}

function saveSalaryRecord(payload) {
  financesStore.upsertSalaryRecord(payload)
  closeEditSalaryModal()
}

function canShowEditButton(card) {
  return (
    canManageFinances.value &&
    (card.entityType === 'tariff' || card.entityType === 'rate' || card.entityType === 'salary')
  )
}

function handleEditCard(card) {
  if (card.entityType === 'tariff') {
    openEditTariffModal(card.id)
  }

  if (card.entityType === 'rate') {
    openEditTeacherRateModal(card.id)
  }

  if (card.entityType === 'salary') {
    openEditSalaryModal(card)
  }
}

function getPersonFullName(person) {
  return [person.surname, person.name, person.patronymic].filter(Boolean).join(' ')
}

function getLessonDurationMinutes(lesson) {
  const start = new Date(lesson.startAt)
  const end = new Date(lesson.endAt)

  return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
}

function getFormatLabel(format) {
  if (format === 'individual') return 'Индивидуальный'
  if (format === 'group') return 'Групповой'
  return format
}

function getTeacherLevelLabel(level) {
  if (level === 'junior') return 'Новичок'
  if (level === 'middle') return 'Опытный'
  if (level === 'senior') return 'Старший'
  return level
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDefaultLastPaymentDate() {
  const date = new Date()
  date.setDate(1)
  return toDateKey(date)
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`)
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}
</script>

<style scoped>
.finance-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.9fr) auto;
  align-items: center;
  gap: 24px;
  min-height: 116px;
}

.card-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  word-break: break-word;
}

.card-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
  word-break: break-word;
}

.card-meta {
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

.card-actions {
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
