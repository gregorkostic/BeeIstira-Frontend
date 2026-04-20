<script setup>
import { ref } from 'vue'
import api from '../services/api'

const lokacija = ref('')
const vrijeme = ref(null)
const error = ref('')
const loading = ref(false)

// Mapa WMO kodova → opis + ikona
const weatherCodes = {
  0: { opis: 'Vedro', ikona: '☀️' },
  1: { opis: 'Uglavnom vedro', ikona: '🌤️' },
  2: { opis: 'Djelomično oblačno', ikona: '⛅' },
  3: { opis: 'Oblačno', ikona: '☁️' },
  45: { opis: 'Magla', ikona: '🌫️' },
  48: { opis: 'Ledena magla', ikona: '🌫️' },
  51: { opis: 'Slaba rosulja', ikona: '🌦️' },
  53: { opis: 'Rosulja', ikona: '🌦️' },
  55: { opis: 'Jaka rosulja', ikona: '🌧️' },
  61: { opis: 'Slaba kiša', ikona: '🌦️' },
  63: { opis: 'Kiša', ikona: '🌧️' },
  65: { opis: 'Jaka kiša', ikona: '🌧️' },
  71: { opis: 'Slabi snijeg', ikona: '🌨️' },
  73: { opis: 'Snijeg', ikona: '❄️' },
  75: { opis: 'Jaki snijeg', ikona: '❄️' },
  80: { opis: 'Pljuskovi', ikona: '🌦️' },
  81: { opis: 'Jaki pljuskovi', ikona: '🌧️' },
  82: { opis: 'Vrlo jaki pljuskovi', ikona: '⛈️' },
  95: { opis: 'Grmljavina', ikona: '⛈️' },
  96: { opis: 'Grmljavina s tučom', ikona: '⛈️' },
  99: { opis: 'Jaka grmljavina s tučom', ikona: '⛈️' }
}

function getWeatherInfo(code) {
  return weatherCodes[code] || { opis: 'Nepoznato', ikona: '🌡️' }
}

async function dohvatiVrijeme() {
  if (!lokacija.value.trim()) return
  
  error.value = ''
  vrijeme.value = null
  loading.value = true
  
  try {
    const response = await api.post('/vrijeme', { lokacija: lokacija.value })
    vrijeme.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Greška pri dohvatu podataka'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="vrijeme-container">
    <h2>🌦️ Vremenski uvjeti</h2>
    <p class="subtitle">Provjeri vremenske uvjete za pčelarske aktivnosti</p>
    
    <form @submit.prevent="dohvatiVrijeme" class="search-form">
      <input 
        type="text" 
        v-model="lokacija" 
        placeholder="Upiši grad (npr. Pula, Rovinj, Zagreb)"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Dohvaćam...' : 'Provjeri' }}
      </button>
    </form>

    <div v-if="error" class="error">
      ⚠️ {{ error }}
    </div>

    <div v-if="vrijeme" class="weather-card">
      <div class="location">📍 {{ vrijeme.lokacija }}</div>
      
      <div class="main-info">
        <div class="icon">{{ getWeatherInfo(vrijeme.uvjeti).ikona }}</div>
        <div class="temp">{{ vrijeme.temperatura }}</div>
      </div>
      
      <div class="description">{{ getWeatherInfo(vrijeme.uvjeti).opis }}</div>
      
      <div class="details">
        <div class="detail-item">
          <span class="label">💨 Vjetar</span>
          <span class="value">{{ vrijeme.vjetar }}</span>
        </div>
      </div>

      <div class="tip">
        <strong>🐝 Savjet za pčelara:</strong>
        <span v-if="vrijeme.uvjeti >= 61 && vrijeme.uvjeti <= 82">
          Kiša – pčele ostaju u košnici, odgodi pregled.
        </span>
        <span v-else-if="vrijeme.uvjeti >= 95">
          Grmljavina – hitno osiguraj košnice!
        </span>
        <span v-else-if="vrijeme.uvjeti >= 71 && vrijeme.uvjeti <= 75">
          Snijeg – pčele hiberniraju, ne otvaraj košnice.
        </span>
        <span v-else-if="vrijeme.uvjeti <= 2">
          Savršeno vrijeme za pregled košnica i aktivnosti!
        </span>
        <span v-else>
          Oblačno – moguće aktivnosti, ali pazi na pčele.
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vrijeme-container {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  color: #f39c12;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #aaa;
  margin-bottom: 2rem;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 6px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #f39c12;
}

button {
  padding: 0.75rem 1.5rem;
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
  padding: 1rem;
  background: #3a2020;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #e74c3c;
  text-align: center;
}

.weather-card {
  padding: 2rem;
  background: linear-gradient(135deg, #2a2a2a, #3a3a2a);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.location {
  font-size: 1.2rem;
  color: #f39c12;
  margin-bottom: 1rem;
}

.main-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.icon {
  font-size: 5rem;
}

.temp {
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.description {
  font-size: 1.3rem;
  color: #ddd;
  margin-bottom: 1.5rem;
}

.details {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  color: #aaa;
  font-size: 0.9rem;
}

.value {
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
}

.tip {
  padding: 1rem;
  background: rgba(243, 156, 18, 0.1);
  border-left: 3px solid #f39c12;
  border-radius: 6px;
  text-align: left;
  color: #ddd;
}

.tip strong {
  color: #f39c12;
  display: block;
  margin-bottom: 0.25rem;
}
</style>