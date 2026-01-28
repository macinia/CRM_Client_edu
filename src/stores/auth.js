import { defineStore } from 'pinia'
import { mockUsers } from '@/mocks/auth'

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
        this.user = user
      }
    },
    async authUser(authData) {
      let currentUser = null
      let data = localStorage.getItem('user')

      if (data) {
        currentUser = JSON.parse(data)
      }
      let usersArray = mockUsers
      usersArray.push(currentUser)
      currentUser = null

      currentUser = usersArray.find((user) => user.email == authData.email)
      if (currentUser) {
        if (currentUser.password == authData.password) {
          this.user = currentUser
        }
      }
    },
  },
})
