import { createRouter, createWebHistory } from 'vue-router'
import CompanyView from '@/views/CompanyView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import ClientsView from '@/views/ClientsView.vue'
import LessonsView from '@/views/LessonsView.vue'
import FinancesView from '@/views/FinancesView.vue'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/company',
      name: 'company',
      component: CompanyView,
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView,
    },
    {
      path: '/',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
    },
    {
      path: '/finances',
      name: 'finances',
      component: FinancesView,
    },
    {
      path: '/lessons',
      name: 'lessons',
      component: LessonsView,
    },
  ],
})

export default router
