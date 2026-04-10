import { defineStore } from 'pinia'

export const useEmployersStore = defineStore('employers', {
  state: () => ({
    employers: [
      {
        id: 4,
        surname: 'Космач',
        name: 'Мария',
        patronymic: 'Романовна',
        email: 'masha@mail.ru',
        phone: '88005553535',
        timezone: '+3',
        role: 'admin',
        status: 'active',
        organizationId: 0,
        color: '#CADFE0',
        notes: '',
        socials: [],
        subjects: [{ id: 0, name: 'string', organizationId: 0 }],
        grades: [0],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 1,
        surname: 'Аверин',
        name: 'Роман',
        patronymic: 'Сергеевич',
        email: 'roman@mail.ru',
        phone: '88005553535',
        timezone: '+3',
        role: 'manager',
        status: 'active',
        organizationId: 0,
        color: '#F2F2D7',
        notes: '',
        socials: [],
        subjects: [{ id: 0, name: 'string', organizationId: 0 }],
        grades: [0],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 2,
        surname: 'Губанова',
        name: 'Елена',
        patronymic: 'Борисовна',
        email: 'elena@mail.ru',
        phone: '88005553535',
        timezone: '+3',
        role: 'teacher',
        status: 'active',
        organizationId: 0,
        color: '#D8F4D6',
        notes: '',
        socials: [],
        subjects: [{ id: 1, name: 'Математика', organizationId: 0 }],
        grades: [0],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 3,
        surname: 'Космач',
        name: 'Михаил',
        patronymic: 'Романович',
        email: 'mihail@mail.ru',
        phone: '88005553535',
        timezone: '+3',
        role: 'admin',
        status: 'active',
        organizationId: 0,
        color: '#CADFE0',
        notes: '',
        socials: [
          {
            socialName: 'masyanya',
            link: 'http://google.com',
          },
        ],
        subjects: [{ id: 0, name: 'string', organizationId: 0 }],
        grades: [0],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
    ],
  }),

  getters: {
    admins: (state) => state.employers.filter((item) => item.role === 'admin'),
    managers: (state) => state.employers.filter((item) => item.role === 'manager'),
    teachers: (state) => state.employers.filter((item) => item.role === 'teacher'),
  },

  actions: {
    getNextId() {
      if (!this.employers.length) return 1
      return Math.max(...this.employers.map((item) => item.id)) + 1
    },

    createEmployer(employer) {
      const now = new Date().toISOString()

      const newEmployer = {
        ...employer,
        id: this.getNextId(),
        createdAt: now,
        updatedAt: now,
      }

      this.employers.push(newEmployer)
    },

    updateEmployer(updatedEmployer) {
      const index = this.employers.findIndex((item) => item.id === updatedEmployer.id)

      if (index === -1) return

      this.employers[index] = {
        ...this.employers[index],
        ...updatedEmployer,
        updatedAt: new Date().toISOString(),
      }
    },

    deleteEmployer(id) {
      this.employers = this.employers.filter((item) => item.id !== id)
    },
  },
})
