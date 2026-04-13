import { defineStore } from 'pinia'

export const useFinancesStore = defineStore('finances', {
  state: () => ({
    tariffs: [
      {
        id: 1,
        title: 'Индивидуальный тариф 60 минут / 8 занятий',
        lessonDurationMinutes: 60,
        lessonsCount: 8,
        format: 'individual',
        price: 4500,
        color: '#F0EFC2',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 2,
        title: 'Индивидуальный тариф 45 минут / 8 занятий',
        lessonDurationMinutes: 45,
        lessonsCount: 8,
        format: 'individual',
        price: 3200,
        color: '#F0EFC2',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 3,
        title: 'Групповой тариф 45 минут / 8 занятий',
        lessonDurationMinutes: 45,
        lessonsCount: 8,
        format: 'group',
        price: 3200,
        color: '#F0EFC2',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
    ],

    teacherRates: [
      {
        id: 1,
        teacherId: 2,
        subject: 'Математика',
        lessonDurationMinutes: 60,
        teacherLevel: 'junior',
        rate: 500,
        color: '#DFF3E2',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 2,
        teacherId: 2,
        subject: 'Физика',
        lessonDurationMinutes: 120,
        teacherLevel: 'middle',
        rate: 900,
        color: '#DFF3E2',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 3,
        teacherId: 2,
        subject: 'Алгебра',
        lessonDurationMinutes: 45,
        teacherLevel: 'middle',
        rate: 350,
        color: '#DFF3E2',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
    ],

    salaryPeriods: [
      {
        id: 1,
        teacherId: 2,
        periodStart: '2026-04-01',
        periodEnd: '2026-04-30',
        color: '#E8E3FA',
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
    ],
  }),

  getters: {
    tariffOptions: (state) =>
      state.tariffs.map((tariff) => ({
        id: tariff.id,
        label: tariff.title,
      })),

    teacherRatesByTeacherId: (state) => (teacherId) =>
      state.teacherRates.filter((rate) => rate.teacherId === teacherId),
  },

  actions: {
    getNextId(items) {
      if (!items.length) return 1
      return Math.max(...items.map((item) => item.id)) + 1
    },

    createTariff(tariff) {
      const now = new Date().toISOString()

      this.tariffs.push({
        ...tariff,
        id: this.getNextId(this.tariffs),
        lessonDurationMinutes: Number(tariff.lessonDurationMinutes) || 0,
        lessonsCount: Number(tariff.lessonsCount) || 0,
        price: Number(tariff.price) || 0,
        format: tariff.format || 'individual',
        color: tariff.color || '#F0EFC2',
        createdAt: now,
        updatedAt: now,
      })
    },

    updateTariff(updatedTariff) {
      const index = this.tariffs.findIndex((item) => item.id === updatedTariff.id)

      if (index === -1) return

      this.tariffs[index] = {
        ...this.tariffs[index],
        ...updatedTariff,
        lessonDurationMinutes:
          Number(
            updatedTariff.lessonDurationMinutes ?? this.tariffs[index].lessonDurationMinutes,
          ) || 0,
        lessonsCount: Number(updatedTariff.lessonsCount ?? this.tariffs[index].lessonsCount) || 0,
        price: Number(updatedTariff.price ?? this.tariffs[index].price) || 0,
        updatedAt: new Date().toISOString(),
      }
    },

    deleteTariff(id) {
      this.tariffs = this.tariffs.filter((item) => item.id !== id)
    },

    createTeacherRate(rate) {
      const now = new Date().toISOString()

      this.teacherRates.push({
        ...rate,
        id: this.getNextId(this.teacherRates),
        teacherId: Number(rate.teacherId),
        lessonDurationMinutes: Number(rate.lessonDurationMinutes) || 0,
        rate: Number(rate.rate) || 0,
        color: rate.color || '#DFF3E2',
        createdAt: now,
        updatedAt: now,
      })
    },

    updateTeacherRate(updatedRate) {
      const index = this.teacherRates.findIndex((item) => item.id === updatedRate.id)

      if (index === -1) return

      this.teacherRates[index] = {
        ...this.teacherRates[index],
        ...updatedRate,
        teacherId: Number(updatedRate.teacherId ?? this.teacherRates[index].teacherId),
        lessonDurationMinutes:
          Number(
            updatedRate.lessonDurationMinutes ?? this.teacherRates[index].lessonDurationMinutes,
          ) || 0,
        rate: Number(updatedRate.rate ?? this.teacherRates[index].rate) || 0,
        updatedAt: new Date().toISOString(),
      }
    },

    deleteTeacherRate(id) {
      this.teacherRates = this.teacherRates.filter((item) => item.id !== id)
    },

    createSalaryPeriod(period) {
      const now = new Date().toISOString()

      this.salaryPeriods.push({
        ...period,
        id: this.getNextId(this.salaryPeriods),
        teacherId: Number(period.teacherId),
        color: period.color || '#E8E3FA',
        createdAt: now,
        updatedAt: now,
      })
    },

    updateSalaryPeriod(updatedPeriod) {
      const index = this.salaryPeriods.findIndex((item) => item.id === updatedPeriod.id)

      if (index === -1) return

      this.salaryPeriods[index] = {
        ...this.salaryPeriods[index],
        ...updatedPeriod,
        teacherId: Number(updatedPeriod.teacherId ?? this.salaryPeriods[index].teacherId),
        updatedAt: new Date().toISOString(),
      }
    },

    deleteSalaryPeriod(id) {
      this.salaryPeriods = this.salaryPeriods.filter((item) => item.id !== id)
    },
  },
})
