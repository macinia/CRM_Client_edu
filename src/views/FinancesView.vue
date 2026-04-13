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
      </UiCardShell>
    </UiCardList>
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

import { useAuthStore } from '@/stores/auth'
import { useFinancesStore } from '@/stores/finances'
import { useEmployersStore } from '@/stores/employers'
import { useLessonsStore } from '@/stores/lessons'

const authStore = useAuthStore()
const financesStore = useFinancesStore()
const employersStore = useEmployersStore()
const lessonsStore = useLessonsStore()

const { tariffs, teacherRates, salaryPeriods } = storeToRefs(financesStore)
const { employers } = storeToRefs(employersStore)
const { lessons } = storeToRefs(lessonsStore)

const activeSection = ref('tariffs')

const isCreateTariffModalOpen = ref(false)
const isCreateTeacherRateModalOpen = ref(false)

const canManageFinances = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager'
})

const showAddButton = computed(() => {
  return canManageFinances.value && activeSection.value !== 'salaries'
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

const teacherRateCards = computed(() => {
  return teacherRates.value.map((rate) => {
    const teacher = teachersMap.value[rate.teacherId]

    return {
      ...rate,
      teacherName: teacher ? getPersonFullName(teacher) : 'Неизвестный преподаватель',
    }
  })
})

const salaryCards = computed(() => {
  return salaryPeriods.value.map((period) => {
    const teacher = teachersMap.value[period.teacherId]
    const teacherName = teacher ? getPersonFullName(teacher) : 'Неизвестный преподаватель'

    const lessonsInPeriod = lessons.value.filter((lesson) => {
      if (lesson.teacherId !== period.teacherId) return false

      const lessonStart = new Date(lesson.startAt)
      const periodStart = new Date(`${period.periodStart}T00:00:00`)
      const periodEnd = new Date(`${period.periodEnd}T23:59:59`)

      return lessonStart >= periodStart && lessonStart <= periodEnd
    })

    const totalMinutes = lessonsInPeriod.reduce((sum, lesson) => {
      return sum + getLessonDurationMinutes(lesson)
    }, 0)

    const totalAmount = lessonsInPeriod.reduce((sum, lesson) => {
      const lessonDurationMinutes = getLessonDurationMinutes(lesson)

      const matchedRate = teacherRates.value.find((rate) => {
        return (
          rate.teacherId === lesson.teacherId &&
          rate.subject === lesson.subject &&
          rate.lessonDurationMinutes === lessonDurationMinutes
        )
      })

      return sum + (matchedRate ? matchedRate.rate : 0)
    }, 0)

    return {
      id: period.id,
      teacherId: period.teacherId,
      teacherName,
      periodStart: period.periodStart,
      periodEnd: period.periodEnd,
      periodLabel: `${formatDate(period.periodStart)} — ${formatDate(period.periodEnd)}`,
      lessonsCount: lessonsInPeriod.length,
      totalMinutes,
      totalAmount,
      color: period.color,
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
    color: rate.color,
    title: rate.teacherName,
    subtitle: rate.subject,
    meta: [
      { label: 'Длительность', value: `${rate.lessonDurationMinutes} мин` },
      { label: 'Уровень', value: getTeacherLevelLabel(rate.teacherLevel) },
      { label: 'Ставка', value: `${rate.rate} ₽` },
    ],
  }))
})

const salaryDisplayCards = computed(() => {
  return salaryCards.value.map((salary) => ({
    id: salary.id,
    color: salary.color,
    title: salary.teacherName,
    subtitle: salary.periodLabel,
    meta: [
      { label: 'Проведено занятий', value: salary.lessonsCount },
      { label: 'Оплачиваемых минут', value: salary.totalMinutes },
      { label: 'Сумма', value: `${salary.totalAmount} ₽` },
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
  return 'Зарплатных периодов пока нет'
})

function openCreateModal() {
  if (activeSection.value === 'tariffs') {
    isCreateTariffModalOpen.value = true
  }

  if (activeSection.value === 'rates') {
    isCreateTeacherRateModalOpen.value = true
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

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`)

  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}
</script>

<style scoped>
.finance-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.9fr);
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
</style>
