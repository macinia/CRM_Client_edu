import { defineStore } from 'pinia'

export const useStudentsStore = defineStore('StudentsStore', {
  state: () => ({
    students: [
      {
        id: 0,
        surname: 'Маматова',
        name: 'Татьяна',
        patronymic: 'Даниловна',
        email: 'mamatovatd@gmail.com',
        phone: '+79033256790',
        timezone: '+5',
        hex: '#E1DEF7',
        birthDate: '25.03.2004',
        grade: '10',
        balance: '3500',
        status: 'ACTIVE',
      },
      {
        id: 1,
        surname: 'Рогачев',
        name: 'Кирилл',
        patronymic: 'Дмитриевич',
        email: 'k-rogach04@gmail.com',
        phone: '+79033256790',
        timezone: +3,
        hex: '#E1DEF7',
        birthDate: '25.03.2004',
        grade: '11',
        balance: '8000',
        status: 'ACTIVE',
      },
      {
        id: 3,
        surname: 'Троценко',
        name: 'Василиса',
        patronymic: 'Евгеньевна',
        email: 'trosenko25@mail.ru',
        phone: '+79033256790',
        timezone: '+4',
        hex: '#E1DEF7',
        birthDate: '25.03.2004',
        grade: '9',
        balance: '3500',
        status: 'ACTIVE',
      },
    ],
  }),
  getters: {
    getStudents() {
      return async () => {
        return this.students
      }
    },
  },
  actions: {
    async createStudent(student) {
      let currentStudent = student
      currentStudent.id = this.student .length + 1
      currentStudent.id = this.student.length + 1
      this.students.push(student)
      console.log(this.students);
    },
  },
})
