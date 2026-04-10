<template>
  <PageLayout>
    <div class="finances-top">
      <h1>Финансы</h1>

      <button v-if="showAddButton" @click="openCreateModal">
        <img src="@/assets/pluse.svg" alt="Добавить" class="plus-icon" />
        {{ addButtonTitle }}
      </button>
    </div>

    <div class="finances-nav">
      <button
        v-for="section in sections"
        :key="section.id"
        @click="selectSection(section.id)"
        :class="['nav-item', { selected: activeSection === section.id }]"
      >
        {{ section.title }} ({{ section.count }})
      </button>
    </div>

    <div class="finances-content">
      <div v-if="activeSection === 'tariffs'" class="card-list">
        <div
          v-for="tariff in tariffs"
          :key="tariff.id"
          class="finance-card"
          :style="{ backgroundColor: tariff.color }"
        >
          <div class="card-main">
            <div class="card-title">{{ tariff.title }}</div>
            <div class="card-subtitle">
              {{ getFormatLabel(tariff.format) }}
            </div>
          </div>

          <div class="card-meta">
            <div>Длительность: {{ tariff.lessonDurationMinutes }} мин</div>
            <div>Количество занятий: {{ tariff.lessonsCount }}</div>
            <div>Стоимость: {{ tariff.price }} ₽</div>
          </div>
        </div>
      </div>

      <div v-else-if="activeSection === 'rates'" class="card-list">
        <div
          v-for="rate in teacherRateCards"
          :key="rate.id"
          class="finance-card"
          :style="{ backgroundColor: rate.color }"
        >
          <div class="card-main">
            <div class="card-title">{{ rate.teacherName }}</div>
            <div class="card-subtitle">{{ rate.subject }}</div>
          </div>

          <div class="card-meta">
            <div>Длительность: {{ rate.lessonDurationMinutes }} мин</div>
            <div>Уровень: {{ getTeacherLevelLabel(rate.teacherLevel) }}</div>
            <div>Ставка: {{ rate.rate }} ₽</div>
          </div>
        </div>
      </div>

      <div v-else class="card-list">
        <div
          v-for="salary in salaryCards"
          :key="salary.id"
          class="finance-card"
          :style="{ backgroundColor: salary.color }"
        >
          <div class="card-main">
            <div class="card-title">{{ salary.teacherName }}</div>
            <div class="card-subtitle">
              {{ salary.periodLabel }}
            </div>
          </div>

          <div class="card-meta">
            <div>Проведено занятий: {{ salary.lessonsCount }}</div>
            <div>Оплачиваемых минут: {{ salary.totalMinutes }}</div>
            <div>Сумма: {{ salary.totalAmount }} ₽</div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import PageLayout from '@/components/PageLayout.vue'

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

const sections = computed(() => [
  { id: 'tariffs', title: 'Тарифы', count: tariffs.value.length },
  { id: 'rates', title: 'Ставки', count: teacherRateCards.value.length },
  { id: 'salaries', title: 'Зарплаты', count: salaryCards.value.length },
])

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

function selectSection(sectionId) {
  activeSection.value = sectionId
}

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

.plus-icon {
  width: 20px;
  height: 20px;
}

.finances-nav {
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

.finances-content {
  margin-top: 20px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.finance-card {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 24px;
  border-radius: 20px;
}

.card-main {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 0.95rem;
  color: #5f5560;
}

.card-meta {
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
