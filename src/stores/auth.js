import { defineStore } from 'pinia'

export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    user: {},
  }),
  getters: {},
  actions: {
    async registerUser(user) {
      let currentUser = null
      let data = localStorage.getItem('user')

      if (data) {
        currentUser = JSON.parse(data)
      }
      if (!currentUser) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
  },
})
