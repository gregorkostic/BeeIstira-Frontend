<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const medovi = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')

// Forma za dodavanje
const noviMed = ref({ naziv: '', cijena: '' })
const showForm = ref(false)
const submitting = ref(false)

// Emoji za različite vrste meda
const honeyEmoji = (naziv) => {
  const n = naziv.toLowerCase()
  if (n.includes('bagrem')) return '🌼'
  if (n.includes('kesten')) return '🌰'
  if (n.includes('cvjet') || n.includes('livad')) return '🌸'
  if (n.includes('lavand')) return '💜'
  if (n.includes('kadulj')) return '🌿'
  return '🍯'
}

async function ucitajMedove() {
  try {
    loading.value = true
    const response = await api.get('/med')
    medovi.value = response.data.ponuda
  } catch (err) {
    error.value = 'Greška pri učitavanju medova'
  } finally {
    loading.value = false
  }
}

async function dodajMed() {
  if (!noviMed.value.naziv || !noviMed.value.cijena) return
  
  submitting.value = true
  try {
    await api.post('/med', {
      naziv: noviMed.value.naziv,
      cijena: Number(noviMed.value.cijena)
    })
    message.value = '✅ Med uspješno dodan!'
    noviMed.value = { naziv: '', cijena: '' }
    showForm.value = false
    await ucitajMedove()
    setTimeout(() => message.value = '', 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri dodavanju'
  } finally {
    submitting.value = false
  }
}

async function kupiMed(med) {
  if (!confirm(`Želiš li kupiti ${med.naziv} za ${med.cijena}€?`)) return
  
  try {
    await api.post('/kupovina', { medId: med._id })
    message.value = `🎉 Uspješno kupljen ${med.naziv}!`
    setTimeout(() => message.value = '', 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri kupovini'
  }
}

async function obrisiMed(med) {
  if (!confirm(`Obrisati ${med.naziv}?`)) return
  
  try {
    await api.delete(`/med/${med._id}`)
    message.value = '🗑️ Med obrisan'
    await ucitajMedove()
    setTimeout(() => message.value = '', 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri brisanju'
  }
}

onMounted(ucitajMedove)
</script>

<template>
  <div class="med-container">
    <div class="header-row">
      <div>
        <h2>🍯 Ponuda meda</h2>
        <p class="subtitle">Domaći med izravno od istarskih pčelara</p>
      </div>
      
      <button 
        v-if="auth.isLoggedIn" 
        @click="showForm = !showForm" 
        class="btn-toggle"
      >
        {{ showForm ? '✕ Zatvori' : '+ Dodaj med' }}
      </button>
    </div>

    <!-- Poruke -->
    <div v-if="message" class="alert success">{{ message }}</div>
    <div v-if="error" class="alert error">⚠️ {{ error }}</div>

    <!-- Forma za dodavanje -->
    <div v-if="showForm && auth.isLoggedIn" class="add-form">
      <h3>Dodaj novi med</h3>
      <form @submit.prevent="dodajMed">
        <div class="field">
          <label>Naziv meda</label>
          <input 
            type="text" 
            v-model="noviMed.naziv" 
            placeholder="npr. Bagremov med"
            required
          />
        </div>
        <div class="field">
          <label>Cijena (€)</label>
          <input 
            type="number" 
            v-model="noviMed.cijena" 
            placeholder="12"
            min="0"
            step="0.5"
            required
          />
        </div>
        <button type="submit" :disabled="submitting" class="btn-submit">
          {{ submitting ? 'Dodajem...' : 'Dodaj u ponudu' }}
        </button>
      </form>
    </div>

    <!-- Info ako nije prijavljen -->
    <div v-if="!auth.isLoggedIn" class="login-hint">
      💡 <router-link to="/login">Prijavi se</router-link> da bi mogao dodavati i kupovati med.
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">Učitavam medove...</div>

    <!-- Prazna ponuda -->
    <div v-else-if="medovi.length === 0" class="empty">
      <p>🤷 Trenutno nema meda u ponudi.</p>
      <p v-if="auth.isLoggedIn">Budi prvi i dodaj svoj!</p>
    </div>

    <!-- Grid medova -->
    <div v-else class="honey-grid">
      <div 
        v-for="med in medovi" 
        :key="med._id" 
        class="honey-card"
      >
        <div class="honey-emoji">{{ honeyEmoji(med.naziv) }}</div>
        <h3>{{ med.naziv }}</h3>
        <div class="price">{{ med.cijena }}€</div>
        <div class="seller">Prodavač: <strong>{{ med.seller }}</strong></div>
        
        <div class="actions" v-if="auth.isLoggedIn">
          <button 
            v-if="med.seller !== auth.username" 
            @click="kupiMed(med)" 
            class="btn-buy"
          >
            🛒 Kupi
          </button>
          <button 
            v-if="med.seller === auth.username" 
            @click="obrisiMed(med)" 
            class="btn-delete"
          >
            🗑️ Obriši
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-container {
  max-width: 1000px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h2 {
  color: #f39c12;
  margin: 0;
}

.subtitle {
  color: #aaa;
  margin: 0.25rem 0 0 0;
}

.btn-toggle {
  padding: 0.75rem 1.5rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}

.btn-toggle:hover {
  background: #e67e22;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.alert.success {
  background: #1e3a1e;
  border: 1px solid #2ecc71;
  color: #2ecc71;
}

.alert.error {
  background: #3a1e1e;
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.add-form {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border-left: 4px solid #f39c12;
}

.add-form h3 {
  color: #f39c12;
  margin-top: 0;
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

.btn-submit {
  padding: 0.75rem 2rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}

.btn-submit:hover:not(:disabled) {
  background: #e67e22;
}

.login-hint {
  text-align: center;
  padding: 1rem;
  background: rgba(243, 156, 18, 0.1);
  border-radius: 8px;
  color: #ccc;
  margin-bottom: 2rem;
}

.login-hint a {
  color: #f39c12;
  font-weight: bold;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #aaa;
}

.honey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.honey-card {
  background: linear-gradient(135deg, #2a2a2a, #3a2a1a);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
}

.honey-card:hover {
  border-color: #f39c12;
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.2);
}

.honey-emoji {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

.honey-card h3 {
  color: #f39c12;
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 0.5rem 0;
}

.seller {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.seller strong {
  color: #ddd;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-buy, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
}

.btn-buy {
  background: #2ecc71;
  color: white;
  width: 100%;
}

.btn-buy:hover {
  background: #27ae60;
}

.btn-delete {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  width: 100%;
}

.btn-delete:hover {
  background: #e74c3c;
  color: white;
}
</style>