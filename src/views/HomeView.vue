<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const features = [
  {
    ikona: '🍯',
    naslov: 'Ponuda meda',
    opis: 'Pregledaj, dodaj i prodaj domaći istarski med izravno od pčelara.',
    ruta: '/med'
  },
  {
    ikona: '💬',
    naslov: 'Iskustva',
    opis: 'Podijeli svoje iskustvo ili pročitaj mišljenja drugih o različitim vrstama meda.',
    ruta: '/iskustva'
  },
  {
    ikona: '🌦️',
    naslov: 'Vremenski uvjeti',
    opis: 'Provjeri trenutno vrijeme u Istri i dobij pčelarski savjet za danas.',
    ruta: '/vrijeme'
  },
  {
    ikona: '📅',
    naslov: 'Kalendar pčelarstva',
    opis: 'Mjesečne aktivnosti kroz godinu — od proljetnog pregleda do zimskog mira.',
    ruta: '/kalendar'
  }
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h2>Dobrodošli u BeeIstria 🐝</h2>
        <p class="tagline">
          Sve o pčelarstvu u Istri — od domaćeg meda do vremenskih savjeta.
        </p>
        
        <div v-if="!auth.isLoggedIn" class="cta-buttons">
          <button @click="router.push('/register')" class="btn-primary">
            Registriraj se
          </button>
          <button @click="router.push('/login')" class="btn-secondary">
            Prijavi se
          </button>
        </div>

        <div v-else class="welcome-back">
          <p>Bok, <strong>{{ auth.username }}</strong>! Drago nam je što si tu. 🌻</p>
        </div>
      </div>
    </section>

    <section class="features">
      <h3>Što te čeka?</h3>
      <div class="feature-grid">
        <div 
          v-for="item in features"
          :key="item.ruta"
          class="feature-card"
          @click="router.push(item.ruta)"
        >
          <div class="feature-icon">{{ item.ikona }}</div>
          <h4>{{ item.naslov }}</h4>
          <p>{{ item.opis }}</p>
          <span class="arrow">→</span>
        </div>
      </div>
    </section>

    <section class="info">
      <h3>🌾 O projektu</h3>
      <p>
        BeeIstria je platforma koja povezuje pčelare i ljubitelje domaćeg meda 
        u Istri. Cilj nam je promicati lokalno pčelarstvo, educirati o radu s 
        pčelama, te olakšati razmjenu proizvoda i iskustava među pčelarima.
      </p>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
}

/* Hero sekcija */
.hero {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: white;
  box-shadow: 0 4px 20px rgba(243, 156, 18, 0.3);
}

.hero h2 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
}

.tagline {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid white;
  transition: all 0.2s;
}

.btn-primary {
  background: white;
  color: #e67e22;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
}

.btn-secondary:hover {
  background: white;
  color: #e67e22;
}

.welcome-back {
  font-size: 1.2rem;
  padding: 1rem;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  display: inline-block;
}

.welcome-back strong {
  color: #fff9c4;
}

/* Features sekcija */
.features {
  margin-bottom: 3rem;
}

.features h3 {
  color: #f39c12;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.feature-card {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.feature-card:hover {
  border-color: #f39c12;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(243, 156, 18, 0.15);
}

.feature-card:hover .arrow {
  transform: translateX(4px);
  color: #f39c12;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.feature-card h4 {
  color: #f39c12;
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.feature-card p {
  color: #bbb;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  color: #666;
  font-size: 1.5rem;
  transition: all 0.2s;
}

/* Info sekcija */
.info {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #f39c12;
  margin-bottom: 2rem;
}

.info h3 {
  color: #f39c12;
  margin: 0 0 1rem 0;
}

.info p {
  color: #ccc;
  line-height: 1.7;
  margin: 0;
}
</style>