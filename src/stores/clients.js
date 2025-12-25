import { defineStore } from 'pinia'

export const useClientsStore = defineStore('ClientsStore', {
  state: () => ({
    clients: [
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
        timezone: "+3",
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
    getClients() {
      return async () => {
        return this.clients
      }
    },
    getFioClients()
    {
      return async ()=>{
      let  array= [];
      this.clients.forEach((client)=> {
        let fio= `${client.surname} ${client.name} ${client.patronymic}`
        array.push({
          id:client.id,
         fio:fio
        })
      })
      return array
      }
    }
  },
  actions: {
    async createClient(client) {
      let currentClient = client
      currentClient.id = this.clients.length + 1
      this.clients.push(client)
    },
  },

})
