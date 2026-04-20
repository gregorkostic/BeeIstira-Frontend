<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const iskustva = ref([])
const medovi = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')

// Forma za dodavanje
const novoIskustvo = ref({ tekst: '', medId: '' })
const showForm = ref(false)
const submitting = ref(false)

// Učitaj sva iskustva + medove istovremeno (za dropdown)
async function ucitajPodatke() {
  try {
    loading.value = true
    const [iskustvaRes, medoviRes] = await Promise.all([
      api.get('/iskustva'),
      api.get('/med')
    ])
    iskustva.value = iskustvaRes.data.experiences
    medovi.value = medoviRes.data.ponuda
  } catch (err) {
    error.value = 'Greška pri učitavanju'
  } finally {
    loading.value = false
  }
}

async function dodajIskustvo() {
  if (!novoIskustvo.value.tekst || !novoIskustvo.value.medId) return
  
  submitting.value = true
  try {
    await api.post('/iskustva', {
      tekst: novoIskustvo.value.tekst,
      medId: novoIskustvo.value.medId
    })
    message.value = '✅ Iskustvo dodano!'
    novoIskustvo.value = { tekst: '', medId: '' }
    showForm.value = false
    await ucitajPodatke()
    setTimeout(() => message.value = '', 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri dodavanju'
  } finally {
    submitting.value = false
  }
}

async function obrisiIskustvo(id) {
  if (!confirm('Obrisati ovaj komentar?')) return
  
  try {
    await api.delete(`/iskustva/${id}`)
    message.value = '🗑️ Komentar obrisan'
    await ucitajPodatke()
    setTimeout(() => message.value = '', 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri brisanju'
  }
}

// Formatiranje datuma
function formatDatum(datum) {
  return new Date(datum).toLocaleDateString('hr-HR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(ucitajPodatke)
</script>

<template>
  <div class="iskustva-container">
    <div class="header-row">
      <div>
        <h2>💬 Iskustva korisnika</h2>
        <p class="subtitle">Podijeli svoja iskustva s domaćim medom</p>
      </div>
      
      <button 
        v-if="auth.isLoggedIn && medovi.length > 0" 
        @click="showForm = !showForm" 
        class="btn-toggle"
      >
        {{ showForm ? '✕ Zatvori' : '+ Dodaj iskustvo' }}
      </button>
    </div>

    <!-- Poruke -->
    <div v-if="message" class="alert success">{{ message }}</div>
    <div v-if="error" class="alert error">⚠️ {{ error }}</div>

    <!-- Forma -->
    <div v-if="showForm && auth.isLoggedIn" class="add-form">
      <h3>Podijeli svoje iskustvo</h3>
      <form @submit.prevent="dodajIskustvo">
        <div class="field">
          <label>Odaberi med</label>
          <select v-model="novoIskustvo.medId" required>
            <option value="" disabled>-- Izaberi vrstu meda --</option>
            <option 
              v-for="med in medovi" 
              :key="med._id" 
              :value="med._id"
            >
              {{ med.naziv }} ({{ med.cijena }}€ - {{ med.seller }})
            </option>
          </select>
        </div>
        <div class="field">
          <label>Tvoj komentar</label>
          <textarea 
            v-model="novoIskustvo.tekst" 
            placeholder="Što misliš o ovom medu?"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" :disabled="submitting" class="btn-submit">
          {{ submitting ? 'Objavljujem...' : 'Objavi iskustvo' }}
        </button>
      </form>
    </div>

    <!-- Info ako nije prijavljen -->
    <div v-if="!auth.isLoggedIn" class="login-hint">
      💡 <router-link to="/login">Prijavi se</router-link> da bi mogao dodati svoje iskustvo.
    </div>

    <!-- Info ako nema medova -->
    <div v-if="auth.isLoggedIn && medovi.length === 0" class="login-hint">
      🍯 Trenutno nema medova u ponudi. 
      <router-link to="/med">Dodaj prvi med</router-link> pa ćeš moći ostavljati iskustva.
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">Učitavam iskustva...</div>

    <!-- Prazna iskustva -->
    <div v-else-if="iskustva.length === 0" class="empty">
      <p>💭 Još nema iskustava.</p>
      <p v-if="auth.isLoggedIn && medovi.length > 0">Budi prvi i podijeli svoje mišljenje!</p>
    </div>

    <!-- Lista iskustava -->
    <div v-else class="iskustva-list">
      <div 
        v-for="iskustvo in iskustva" 
        :key="iskustvo._id" 
        class="iskustvo-card"
      >
        <div class="card-header">
          <div class="user-info">
            <div class="avatar">{{ iskustvo.username.charAt(0).toUpperCase() }}</div>
            <div>
              <div class="username">{{ iskustvo.username }}</div>
              <div class="date">{{ formatDatum(iskustvo.createdAt) }}</div>
            </div>
          </div>
          
          <button 
            v-if="auth.isLoggedIn && iskustvo.username === auth.username"
            @click="obrisiIskustvo(iskustvo._id)"
            class="btn-delete-small"
            title="Obriši"
          >
            🗑️
          </button>
        </div>

        <div class="tekst">"{{ iskustvo.tekst }}"</div>

        <div v-if="iskustvo.medId" class="med-tag">
          🍯 {{ iskustvo.medId.naziv }} 
          <span class="price">{{ iskustvo.medId.cijena }}€</span>
        </div>
        <div v-else class="med-tag deleted">
          🍯 <em>(med je obrisan)</em>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iskustva-container {
  max-width: 800px;
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

select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
}

select:focus, textarea:focus {
  outline: none;
  border-color: #f39c12;
}

textarea {
  resize: vertical;
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

/* Lista iskustava */
.iskustva-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.iskustvo-card {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.iskustvo-card:hover {
  border-color: #f39c12;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
}

.username {
  color: #f39c12;
  font-weight: bold;
}

.date {
  color: #888;
  font-size: 0.85rem;
}

.btn-delete-small {
  background: transparent;
  border: 1px solid #555;
  color: #888;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-delete-small:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

.tekst {
  color: #ddd;
  font-size: 1.05rem;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.med-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(243, 156, 18, 0.15);
  border: 1px solid rgba(243, 156, 18, 0.3);
  border-radius: 20px;
  color: #f39c12;
  font-size: 0.9rem;
  font-weight: bold;
}

.med-tag .price {
  color: white;
  margin-left: 0.5rem;
}

.med-tag.deleted {
  background: rgba(150, 150, 150, 0.1);
  border-color: #555;
  color: #888;
}
</style>