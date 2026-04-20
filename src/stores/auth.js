import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const username = ref(localStorage.getItem('username') || null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  async function login(user, password) {
    const response = await api.post('/login', { username: user, password })
    token.value = response.data.token
    username.value = user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', user)
    return response.data
  }

  async function register(user, password) {
    const response = await api.post('/register', { username: user, password })
    token.value = response.data.token
    username.value = user
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', user)
    return response.data
  }

  function logout() {
    token.value = null
    username.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  return { token, username, isLoggedIn, login, register, logout }
})