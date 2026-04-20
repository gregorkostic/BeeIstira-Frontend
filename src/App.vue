<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="app">
    <header>
      <h1>🐝 BeeIstria</h1>
      <nav>
        <router-link to="/">Početna</router-link>
        <router-link to="/med">Med</router-link>
        <router-link to="/iskustva">Iskustva</router-link>
        <router-link to="/vrijeme">Vrijeme</router-link>
        <router-link to="/kalendar">Kalendar</router-link>
        
        <template v-if="auth.isLoggedIn">
          <span class="welcome">Bok, {{ auth.username }}! 🐝</span>
          <button @click="handleLogout" class="logout-btn">Odjava</button>
        </template>
        
        <template v-else>
          <router-link to="/login">Prijava</router-link>
          <router-link to="/register">Registracija</router-link>
        </template>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
.app {
  font-family: system-ui, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  border-bottom: 2px solid #f39c12;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

h1 {
  color: #f39c12;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #bbb;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

nav a:hover {
  background-color: #3a3a3a;
  color: #f39c12;
}

nav a.router-link-active {
  background-color: #f39c12;
  color: white;
}

.welcome {
  color: #f39c12;
  font-weight: bold;
  margin-left: 1rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

.logout-btn:hover {
  background: #e74c3c;
  color: white;
}

main {
  padding: 1rem;
}
</style>