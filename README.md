# 🐝 BeeIstria — Frontend

Vue 3 aplikacija za platformu BeeIstria — sve o pčelarstvu u Istri. Omogućuje registraciju, prijavu, pregled i kupovinu meda, komentare, provjeru vremena i pčelarski kalendar.

## 🛠️ Tehnologije

- **Vue 3** (Composition API) — frontend framework
- **Vite** — build tool i dev server
- **Vue Router** — navigacija
- **Pinia** — state management
- **Axios** — HTTP klijent za komunikaciju s backendom

## 📋 Preduvjeti

- [Node.js](https://nodejs.org) (LTS verzija)
- Backend mora biti pokrenut na `http://localhost:3000`

👉 [BeeIstira-Backend](https://github.com/gregorkostic/BeeIstira-Backend)

## ⚙️ Instalacija

```bash
# 1. Kloniraj repozitorij
git clone https://github.com/gregorkostic/BeeIstira-Frontend.git
cd BeeIstira-Frontend

# 2. Instaliraj dependencies
npm install
```

## 🚀 Pokretanje

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

> ⚠️ **Važno:** Prije korištenja aplikacije, pokreni i backend server (`node index.js` u backend projektu).

## 📱 Stranice

| Ruta | Opis | Auth |
|---|---|---|
| `/` | Početna s overview-om | ❌ |
| `/register` | Registracija | ❌ |
| `/login` | Prijava | ❌ |
| `/med` | Ponuda meda + dodavanje + kupnja | ⚠️ Djelomično |
| `/iskustva` | Komentari korisnika + dodavanje | ⚠️ Djelomično |
| `/vrijeme` | Provjera vremenskih uvjeta | ❌ |
| `/kalendar` | Kalendar pčelarskih aktivnosti | ❌ |

## ✨ Značajke

- 🔐 **Registracija i prijava** s JWT autentikacijom
- 💾 **Perzistentan login** kroz localStorage (preživljava refresh)
- 🍯 **Tržište meda** — dodaj, pregledaj, kupi
- 💬 **Iskustva korisnika** — komentari povezani s medovima
- 🌦️ **Provjera vremena** s pčelarskim savjetima
- 📅 **Kalendar pčelarstva** — mjesečni prikaz aktivnosti
- 🎨 **Dark theme** s narančastim brand bojama
- 📱 **Responzivan dizajn** (CSS Grid + Flexbox)

## 🗂️ Struktura projekta

