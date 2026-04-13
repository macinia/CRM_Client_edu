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
        phone: '+7 (800) 555-35-35',
        timezone: '+3',
        role: 'admin',
        status: 'active',
        organizationId: 0,
        color: '#CADFE0',
        notes: '',
        subjects: [],
        grades: [],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 1,
        surname: 'Аверин',
        name: 'Роман',
        patronymic: 'Сергеевич',
        email: 'roman@mail.ru',
        phone: '+7 (800) 555-35-35',
        timezone: '+3',
        role: 'manager',
        status: 'active',
        organizationId: 0,
        color: '#F2F2D7',
        notes: '',
        subjects: [],
        grades: [],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 2,
        surname: 'Губанова',
        name: 'Елена',
        patronymic: 'Борисовна',
        email: 'elena@mail.ru',
        phone: '+7 (903) 319-75-90',
        timezone: '+3',
        role: 'teacher',
        status: 'active',
        organizationId: 0,
        color: '#D8F4D6',
        notes: '',
        subjects: ['Математика', 'Алгебра'],
        grades: [5, 6, 7, 8, 9],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 3,
        surname: 'Космач',
        name: 'Михаил',
        patronymic: 'Романович',
        email: 'mihail@mail.ru',
        phone: '+7 (800) 555-35-35',
        timezone: '+3',
        role: 'admin',
        status: 'active',
        organizationId: 0,
        color: '#CADFE0',
        notes: '',
        subjects: [],
        grades: [],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 5,
        surname: 'Орлова',
        name: 'Ирина',
        patronymic: 'Андреевна',
        email: 'i.orlova@mail.ru',
        phone: '+7 (903) 555-12-21',
        timezone: '+3',
        role: 'teacher',
        status: 'active',
        organizationId: 0,
        color: '#D9EEF8',
        notes: '',
        subjects: ['Математика', 'Физика'],
        grades: [7, 8, 9, 10, 11],
        createdAt: '2025-02-22T12:32:17.867Z',
        updatedAt: '2025-02-22T12:32:17.867Z',
      },
      {
        id: 6,
        surname: 'Соколова',
        name: 'Анна',
        patronymic: 'Игоревна',
        email: 'a.sokolova@mail.ru',
        phone: '+7 (903) 777-44-11',
        timezone: '+3',
        role: 'teacher',
        status: 'active',
        organizationId: 0,
        color: '#F7E4D8',
        notes: '',
        subjects: ['Русский язык', 'Литература'],
        grades: [5, 6, 7, 8, 9, 10, 11],
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
