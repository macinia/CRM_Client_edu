import { defineStore } from 'pinia'

export const useStavkaStore = defineStore('StavkaStore', {
  state: () => ({
    stavkas: [
      {
        id: 0,
        name: "60 минут, новичок, математика, индивид  ",
        price: "500"
      },
      {
        id: 2,
        name: "60 минут, опытный, математика, индивид  ",
        price: "300"
      },
      {
        id: 3,
        name: "45 минут, опытный, гуманитарные науки, индивид ",
        price: "200"
      },
    ],
  }),
  getters: {
    getStavkas() {
      return async () => {
        return this.stavkas
      }
    },
  },
  actions: {
    async createStavka(stavka) {
      let currentStavka = stavka
      currentStavka.id = this.stavkas.length + 1
      this.stavkas.push(stavka)
    },
  },
})
