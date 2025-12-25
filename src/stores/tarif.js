import { defineStore } from 'pinia'

export const useTarifStore = defineStore('TarifStore', {
  state: () => ({
    tarifs: [
      {
        id: 0,
        name: "По 60 минут ( 8 занятий, индивидуальные) ",
        lessonsCount: "8",
        price: "4500",
      hex: "#F0EFC2"
      },
      {
        id: 2,
        name: "По 45 минут ( 8 занятий, индивидуальные) ",
        lessonsCount: "8",
        price: "3200",
        hex: "#F0EFC2"
      },
      {
        id: 3,
        name: "По 45 минут ( 8 занятий, групповые) ",
        lessonsCount: "8",
        price: "3200",
        hex: "#F0EFC2"
      },
    ],
  }),
  getters: {
    getTarifs() {
      return async () => {
        return this.tarifs
      }
    },
  },
  actions: {
    async createTarif(tarif) {
      let currentTarif = tarif
      currentTarif.id = this.tarifs.length + 1
      this.tarifs.push(tarif)
    },
  },
})
