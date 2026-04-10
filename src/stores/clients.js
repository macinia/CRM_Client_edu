import { defineStore } from 'pinia'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [
      {
        id: 1,
        surname: 'Маматова',
        name: 'Татьяна',
        patronymic: 'Даниловна',
        email: 'mamatovatd@gmail.com',
        phone: '+79033256790',
        timezone: '+5',
        color: '#E1DEF7',
        birthDate: '2004-03-25',
        grade: 10,
        balance: 3500,
        status: 'active',
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 2,
        surname: 'Рогачев',
        name: 'Кирилл',
        patronymic: 'Дмитриевич',
        email: 'k-rogach04@gmail.com',
        phone: '+79033256790',
        timezone: '+3',
        color: '#E1DEF7',
        birthDate: '2004-03-25',
        grade: 11,
        balance: 8000,
        status: 'active',
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 3,
        surname: 'Троценко',
        name: 'Василиса',
        patronymic: 'Евгеньевна',
        email: 'trosenko25@mail.ru',
        phone: '+79033256790',
        timezone: '+4',
        color: '#E1DEF7',
        birthDate: '2004-03-25',
        grade: 9,
        balance: 3500,
        status: 'active',
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
    ],
  }),

  getters: {
    clientOptions: (state) =>
      state.clients.map((client) => ({
        id: client.id,
        label: `${client.surname} ${client.name} ${client.patronymic}`.trim(),
      })),

    activeClients: (state) => state.clients.filter((client) => client.status === 'active'),

    inactiveClients: (state) => state.clients.filter((client) => client.status === 'inactive'),
  },

  actions: {
    getNextId() {
      if (!this.clients.length) return 1
      return Math.max(...this.clients.map((client) => client.id)) + 1
    },

    createClient(client) {
      const now = new Date().toISOString()

      const newClient = {
        ...client,
        id: this.getNextId(),
        balance: Number(client.balance) || 0,
        grade: Number(client.grade) || null,
        status: client.status || 'active',
        color: client.color || '#E1DEF7',
        createdAt: now,
        updatedAt: now,
      }

      this.clients.push(newClient)
    },

    updateClient(updatedClient) {
      const index = this.clients.findIndex((client) => client.id === updatedClient.id)

      if (index === -1) return

      this.clients[index] = {
        ...this.clients[index],
        ...updatedClient,
        balance: Number(updatedClient.balance ?? this.clients[index].balance) || 0,
        grade: Number(updatedClient.grade ?? this.clients[index].grade) || null,
        updatedAt: new Date().toISOString(),
      }
    },

    deleteClient(id) {
      this.clients = this.clients.filter((client) => client.id !== id)
    },
  },
})
