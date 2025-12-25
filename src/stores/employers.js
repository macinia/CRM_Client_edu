import { defineStore } from 'pinia'

export const useEmployersStore = defineStore('EmployersStore', {
  state: () => ({
    employers: [
      {
        user: {
          id: 0,
          surname: 'Космач',
          name: 'Мария',
          patronymic: 'Романовна',
          email: 'masha@mail.ru',
          phone: '88005553535',
          timezone: '+3',
          createdAt: '2025-02-22T12:32:17.867Z',
          updatedAt: '2025-02-22T12:32:17.867Z',
          role: 'Администратор',
          status: 'ACTIVE',
          organization: 0,
          hex: ' #CADFE0',
        },
        notes: '',
        subjects: [
          {
            id: 0,
            name: 'string',
            organization: 0,
          },
        ],
        grades: [0],
      },
      {
        id: 1,
        user: {
          id: 1,
          surname: 'Аверин ',
          name: 'Роман',
          patronymic: 'Сергеевич',
          email: 'masha@mail.ru',
          phone: '88005553535',
          timezone: '+3',
          createdAt: '2025-02-22T12:32:17.867Z',
          updatedAt: '2025-02-22T12:32:17.867Z',
          role: 'Менеджер',
          hex: ' #F2F2D7',
          status: 'ACTIVE',
          organization: 0,
        },
        notes: '',
        subjects: [
          {
            id: 0,
            name: 'string',
            organization: 0,
          },
        ],
        grades: [0],
      },
      {
        id: 2,
        user: {
          id: 2,
          surname: 'Губанова',
          name: 'Елена',
          patronymic: 'Борисовна',
          email: 'masha@mail.ru',
          phone: '88005553535',
          timezone: '+3',
          createdAt: '2025-02-22T12:32:17.867Z',
          updatedAt: '2025-02-22T12:32:17.867Z',
          role: 'Преподаватель',
          status: 'ACTIVE',
          hex: ' #D8F4D6',
          organization: 0,
        },
        notes: '',
        subjects: [
          {
            id: 0,
            name: 'string',
            organization: 0,
          },
        ],
        grades: [0],
      },
      {
        id: 3,
        user: {
          id: 3,
          surname: 'Космач',
          name: 'Михаил',
          patronymic: 'Романович',
          email: 'masha@mail.ru',
          phone: '88005553535',
          timezone: '+3',
          createdAt: '2025-02-22T12:32:17.867Z',
          updatedAt: '2025-02-22T12:32:17.867Z',
          role: 'Администратор',
          status: 'ACTIVE',
          hex: ' #CADFE0',
          organization: 0,
        },
        socials: [
          {
            socialName: 'masyanya',
            link: 'htttp://google.com',
          },
        ],
        notes: '',
        subjects: [
          {
            id: 0,
            name: 'string',
            organization: 0,
          },
        ],
        grades: [0],
      },
    ],
  }),
  getters: {
    getEmployers() {
      return async () => {
        return this.employers
      }
    },
    getTeachers() {
      return async() =>
      {
        return this.employers.filter( (employer) =>{
         return  employer.user.role === 'Преподаватель'
        } )
      }
    }
  },
  actions: {
    async createEmployer(employer) {
      let currentEmployer=employer
      currentEmployer.id=this.employers.length+1
      currentEmployer.user.id=this.employers.length+1
      this.employers.push(employer)
      console.log(this.employers);

    },
  },
})
