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
        subjectId: 1,
        lessonDurationMinutes: 60,
        teacherLevel: 'junior',
        rate: 500,
        color: '#DFF3E2',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 2,
        subjectId: 2,
        lessonDurationMinutes: 120,
        teacherLevel: 'middle',
        rate: 900,
        color: '#DFF3E2',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 3,
        subjectId: 3,
        lessonDurationMinutes: 45,
        teacherLevel: 'middle',
        rate: 350,
        color: '#DFF3E2',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
    ],

    salaryRecords: [
      {
        id: 1,
        teacherId: 2,
        lastPaymentDate: '2026-04-01',
        lastPaymentAmount: 12000,
        color: '#E8E3FA',
        organizationId: 0,
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
        subjectId: Number(rate.subjectId),
        lessonDurationMinutes: Number(rate.lessonDurationMinutes) || 0,
        rate: Number(rate.rate) || 0,
        color: rate.color || '#DFF3E2',
        organizationId: Number(rate.organizationId) || 0,
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
        subjectId: Number(updatedRate.subjectId ?? this.teacherRates[index].subjectId),
        lessonDurationMinutes:
          Number(
            updatedRate.lessonDurationMinutes ?? this.teacherRates[index].lessonDurationMinutes,
          ) || 0,
        rate: Number(updatedRate.rate ?? this.teacherRates[index].rate) || 0,
        organizationId:
          Number(updatedRate.organizationId ?? this.teacherRates[index].organizationId) || 0,
        updatedAt: new Date().toISOString(),
      }
    },

    deleteTeacherRate(id) {
      this.teacherRates = this.teacherRates.filter((item) => item.id !== id)
    },

    upsertSalaryRecord(payload) {
      const now = new Date().toISOString()

      const normalizedRecord = {
        teacherId: Number(payload.teacherId),
        lastPaymentDate: payload.lastPaymentDate,
        lastPaymentAmount: Number(payload.lastPaymentAmount) || 0,
        color: payload.color || '#E8E3FA',
        organizationId: Number(payload.organizationId) || 0,
      }

      const index = this.salaryRecords.findIndex(
        (item) => item.teacherId === normalizedRecord.teacherId,
      )

      if (index === -1) {
        this.salaryRecords.push({
          id: this.getNextId(this.salaryRecords),
          ...normalizedRecord,
          createdAt: now,
          updatedAt: now,
        })
        return
      }

      this.salaryRecords[index] = {
        ...this.salaryRecords[index],
        ...normalizedRecord,
        updatedAt: now,
      }
    },
  },
})
