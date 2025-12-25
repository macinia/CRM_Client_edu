import { defineStore } from 'pinia'

export const useLessonsStore = defineStore('LessonsStore', {
  state: () => ({
    lessons: [

    ],
  }),
  getters: {
    getLessons() {
      return async () => {
        return this.lessons
      }
    },
  },
  actions: {
    async createLesson(lesson) {
      let currentLesson=lesson
      currentLesson.id=this.lessons.length+1
      currentLesson.user.id=this.lessons.length+1
      console.log
      this.lessons.push(lesson)
      console.log(this.lessons);

    },
  },
})
