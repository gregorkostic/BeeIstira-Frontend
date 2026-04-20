<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri prijavi'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <h2>🔐 Prijava</h2>
    
    <form @submit.prevent="handleLogin">
      <div class="field">
        <label>Korisničko ime</label>
        <input 
          type="text" 
          v-model="username" 
          required 
          placeholder="tvoje korisničko ime"
        />
      </div>

      <div class="field">
        <label>Lozinka</label>
        <input 
          type="password" 
          v-model="password" 
          required 
          placeholder="tvoja lozinka"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Prijavljujem...' : 'Prijavi se' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <p class="hint">
      Nemaš račun? 
      <router-link to="/register">Registriraj se</router-link>
    </p>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

h2 {
  text-align: center;
  color: #f39c12;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ccc;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #f39c12;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

button:hover:not(:disabled) {
  background: #e67e22;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}

.hint {
  text-align: center;
  margin-top: 1rem;
  color: #aaa;
}

.hint a {
  color: #f39c12;
}
</style>