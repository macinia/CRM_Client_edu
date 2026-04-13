import { defineStore } from 'pinia'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    clientTariffs: [
      {
        id: 1,
        clientId: 1,
        subjectId: 1,
        tariffId: 1,
        position: 1,
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 2,
        clientId: 1,
        subjectId: 2,
        tariffId: 2,
        position: 2,
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
      {
        id: 3,
        clientId: 2,
        subjectId: 3,
        tariffId: 2,
        position: 1,
        organizationId: 0,
        createdAt: '2026-04-01T12:00:00.000Z',
        updatedAt: '2026-04-01T12:00:00.000Z',
      },
    ],
  }),

  getters: {
    getClientTariffsByClientId: (state) => (clientId) => {
      return state.clientTariffs
        .filter((item) => item.clientId === clientId)
        .sort((a, b) => a.position - b.position)
    },
  },

  actions: {
    getNextId() {
      if (!this.clientTariffs.length) return 1
      return Math.max(...this.clientTariffs.map((item) => item.id)) + 1
    },

    replaceClientTariffsForClient({ clientId, organizationId = 0, items = [] }) {
      const now = new Date().toISOString()

      this.clientTariffs = this.clientTariffs.filter((item) => item.clientId !== clientId)

      let nextId = this.getNextId()

      const normalizedItems = items
        .filter((item) => item.subjectId && item.tariffId)
        .map((item, index) => ({
          id: nextId + index,
          clientId: Number(clientId),
          subjectId: Number(item.subjectId),
          tariffId: Number(item.tariffId),
          position: index + 1,
          organizationId,
          createdAt: now,
          updatedAt: now,
        }))

      this.clientTariffs.push(...normalizedItems)
    },
  },
})
