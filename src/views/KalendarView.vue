<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const kalendar = ref([])
const loading = ref(true)
const error = ref('')

// Emojiji po sezonama
const mjesecIkone = {
  'Siječanj': '❄️',
  'Veljača': '🌱',
  'Ožujak': '🌸',
  'Travanj': '🌷',
  'Svibanj': '🌻',
  'Lipanj': '☀️',
  'Srpanj': '🍯',
  'Kolovoz': '🌾',
  'Rujan': '🍂',
  'Listopad': '🍁',
  'Studeni': '🌫️',
  'Prosinac': '⛄'
}

onMounted(async () => {
  try {
    const response = await api.get('/informacije/pcelarstvo/kalendar')
    kalendar.value = response.data.kalendar
  } catch (err) {
    error.value = 'Greška pri učitavanju kalendara'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="kalendar-container">
    <h2>📅 Kalendar pčelarstva</h2>
    <p class="subtitle">Mjesečne aktivnosti tijekom godine</p>

    <div v-if="loading" class="loading">
      Učitavam kalendar...
    </div>

    <div v-else-if="error" class="error">
      ⚠️ {{ error }}
    </div>

    <div v-else class="calendar-grid">
      <div 
        v-for="mjesec in kalendar" 
        :key="mjesec.mjesec" 
        class="month-card"
      >
        <div class="icon">{{ mjesecIkone[mjesec.mjesec] || '📆' }}</div>
        <h3>{{ mjesec.mjesec }}</h3>
        <p>{{ mjesec.aktivnost }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kalendar-container {
  max-width: 1000px;
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

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #aaa;
}

.error {
  color: #e74c3c;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.month-card {
  background: linear-gradient(135deg, #2a2a2a, #3a2a1a);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
}

.month-card:hover {
  transform: translateY(-4px);
  border-color: #f39c12;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.2);
}

.icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

h3 {
  color: #f39c12;
  margin: 0.5rem 0;
  font-size: 1.3rem;
}

.month-card p {
  color: #ddd;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}
</style>