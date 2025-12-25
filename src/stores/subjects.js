import { defineStore } from 'pinia'

export const useSubjectStore = defineStore('SubjectStore', {
  state: () => ({
    subjects: [
      {
        id: 0,
        name: "Математика ",
      },
      {
        id: 2,
        name: "Физика  ",
      },
      {
        id: 3,
        name: "Русский язык ",
      },
    ],
  }),
  getters: {
    getSubjects() {
      return async () => {
        return this.subjects
      }
    },
  },
  actions: {
    async createSubject(subject) {
      let currentSubject = subject
      currentSubject.id = this.subjects.length + 1
      this.subjects.push(subject)
    },
  },
})
