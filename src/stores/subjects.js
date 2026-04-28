import { defineStore } from 'pinia'

export const useSubjectsStore = defineStore('subjects', {
  state: () => ({
    subjects: [
      {
        id: 1,
        name: 'Математика',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 2,
        name: 'Физика',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 3,
        name: 'Русский язык',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 4,
        name: 'Алгебра',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 5,
        name: 'Литература',
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
    ],
  }),

  getters: {
    subjectOptions: (state) =>
      state.subjects.map((subject) => ({
        value: subject.id,
        label: subject.name,
      })),
  },

  actions: {
    getNextId() {
      if (!this.subjects.length) return 1
      return Math.max(...this.subjects.map((item) => item.id)) + 1
    },

    createSubject(subject) {
      const now = new Date().toISOString()

      this.subjects.push({
        id: this.getNextId(),
        name: subject.name.trim(),
        organizationId: subject.organizationId ?? 0,
        createdAt: now,
        updatedAt: now,
      })
    },
  },
})
