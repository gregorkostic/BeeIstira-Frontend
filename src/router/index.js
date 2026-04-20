import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MedView from '../views/MedView.vue'
import IskustvaView from '../views/IskustvaView.vue'
import VrijemeView from '../views/VrijemeView.vue'
import KalendarView from '../views/KalendarView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/med', name: 'Med', component: MedView },
  { path: '/iskustva', name: 'Iskustva', component: IskustvaView },
  { path: '/vrijeme', name: 'Vrijeme', component: VrijemeView },
  { path: '/kalendar', name: 'Kalendar', component: KalendarView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router