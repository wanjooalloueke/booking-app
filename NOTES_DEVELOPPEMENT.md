# 📚 NOTES DE DÉVELOPPEMENT - Booking.CI

## 🎯 Vue d'ensemble du projet

Booking.CI est une application web complète de réservation pour hôtels et restaurants en Côte d'Ivoire.

**Stack technique :**
- Frontend : HTML, CSS, JavaScript
- Backend : Node.js + Express
- Base de données : MySQL
- Authentification : JWT + bcrypt

---

## 🏗️ Architecture générale

```
┌─────────────────────────────────────────┐
│          NAVIGATEUR (FRONTEND)          │
│  HTML5 + CSS3 + JavaScript Vanilla      │
└────────────────┬────────────────────────┘
                 │
         HTTP/CORS (JSON)
                 │
         ┌───────▼────────┐
         │  EXPRESS API   │
         │  (Backend)     │
         └───────┬────────┘
                 │
              SQL
                 │
         ┌───────▼────────┐
         │     MySQL      │
         │   (Database)   │
         └────────────────┘
```

---

## 📂 Organisation des fichiers

### Frontend (`/frontend`)

```
frontend/
├── index.html       → Page principale (unique)
├── css/
│   └── styles.css   → Tous les styles (responsive)
└── js/
    └── app.js       → Toute la logique JavaScript
```

**Points clés :**
- Single Page Application : Une seule HTML
- Pas de framework (HTML/CSS/JS pur)
- Design responsive : Mobile first
- Communication avec API en AJAX

---

### Backend (`/backend`)

```
backend/
├── server.js                    → Point d'entrée principal
├── config/
│   └── database.js             → Configuration MySQLconnexions
├── middleware/
│   └── auth.js                 → JWT et authentification
├── models/                      → Couche données
│   ├── User.js                 → Gestion utilisateurs
│   ├── Hotel.js                → Gestion hôtels
│   ├── Restaurant.js           → Gestion restaurants
│   └── Reservation.js          → Gestion réservations
├── controllers/                 → Logique métier
│   ├── authController.js       → Inscription/connexion
│   ├── hotelController.js      → CRUD hôtels
│   ├── restaurantController.js → CRUD restaurants
│   └── reservationController.js→ Gestion réservations
└── routes/                      → Définition des endpoints
    ├── authRoutes.js           → /api/auth
    ├── hotelRoutes.js          → /api/hotels
    ├── restaurantRoutes.js     → /api/restaurants
    └── reservationRoutes.js    → /api/reservations
```

**Architecture MVC :**
- **Models** : Accès à la base de données
- **Controllers** : Logique métier et validation
- **Routes** : Points d'accès HTTP
- **Middleware** : Authentification et autorisations

---

## 🔄 Flux de données

### Exemple : Créer une réservation

```
1. FRONTEND
   ├─ Utilisateur clique "Réserver"
   ├─ JavaScript collecte les données
   ├─ Envoie POST à /api/reservations
   └─ Headers: Authorization: Bearer <token>

2. BACKEND
   ├─ Express reçoit la requête
   ├─ Middleware auth : valide le token
   ├─ Route dirige vers reservationController
   ├─ Controller valide les données
   └─ Appelle Reservation.create() du model

3. MODEL
   ├─ Vérifier les disponibilités
   ├─ Insérer dans la base de données
   └─ Retourner l'ID de la réservation

4. RESPONSE
   ├─ Controller envoie la réponse JSON
   └─ Frontend affiche la confirmation
```

---

## 🔐 Sécurité

### Authentification JWT (JSON Web Token)

```javascript
// 1. Utilisateur se connecte
POST /api/auth/login
Body: {email, password}
├─ Hasher le password avec bcrypt
├─ Comparer avec BD
└─ Générer JWT token → Client

// 2. Requêtes ultérieures
GET /api/hotels
Header: Authorization: Bearer <token>
├─ Middleware extrait le token
├─ Vérifie la signature
├─ Decode les infos utilisateur
└─ Laisse passer ou rejette

// 3. Token expiré
├─ Expire après 24h
└─ Utilisateur doit se reconnecter
```

### Schéma des mots de passe

```javascript
// Inscription
plainPassword = "monPassword123"
├─ Générer salt (10 rounds)
├─ Hasher password + salt
└─ Stocker hash en BD (jamais le plaintext)

// Connexion
plainPassword = "monPassword123"
├─ Récupérer hash de la BD
├─ Comparer avec bcrypt.compare()
└─ Autoriser si match

// Avantage
├─ Impossible de retrouver plaintext
├─ Même password = hash différent
└─ Résistant aux attaques
```

---

## 💾 Base de données

### Schéma relationnel

```sql
users (1) --L-- (N) reservations
hotels (1) --------L (N) reservations
restaurants (1) ---L (N) reservations
```

### Tables principales

#### users
```sql
id          INT PRIMARY KEY
nom         VARCHAR(100)
email       VARCHAR(100) UNIQUE
mot_de_passe VARCHAR(255) -- HASH seulement
role        ENUM('client', 'admin')
```

#### hotels & restaurants
```sql
id              INT PRIMARY KEY
nom             VARCHAR(150)
ville           VARCHAR(100)
description     TEXT
prix            DECIMAL(10,2) -- FCFA
disponibilite   TINYINT(1) -- 0 ou 1
image           VARCHAR(255)
note            DECIMAL(3,1)
nombre_avis     INT
```

#### reservations
```sql
id              INT PRIMARY KEY
user_id         INT FK users(id)
type            ENUM('hotel', 'restaurant')
item_id         INT -- ID hôtel ou restaurant
date_debut      DATE
date_fin        DATE
nombre_personnes INT
statut          ENUM('confirmée', 'en attente', 'annulée')
```

---

## 🎨 Frontend - Principes

### Structure HTML

```html
<!-- Navigation (sticky) -->
<nav>4 items : HÔTEL, RESTAURANT, RÉSERVATION, CONNEXION</nav>

<!-- Hero Section -->
<section class="hero">Titre + Recherche</section>

<!-- Résultats -->
<section id="hotels">Grid de cartes</section>
<section id="restaurants">Grid de cartes</section>
<section id="reservations">Liste réservations</section>

<!-- Modal Auth -->
<div id="authModal">Login + Register forms</div>
```

### CSS - Approche

```css
/* Variablescouleur */
:root {
  --primary-color: #FF6B35;    /* Orange */
  --secondary-color: #004E89;  /* Bleu */
  --accent-color: #F7B801;     /* Or */
}

/* Design système */
.container { max-width: 1200px; }
.btn { padding, border-radius, transition }
.card { box-shadow, hover effect }

/* Responsive */
mobile first
breakpoints: 480px, 768px, 1024px

/* Animated */
transitions, keyframes
smooth scrolling
hover states
```

### JavaScript - Patterns

```javascript
// 1. Variables globales
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// 2. IIFE pour namespace
document.addEventListener('DOMContentLoaded', () => {
  loadHotels();
  initializeEventListeners();
});

// 3. Fetch API
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify(data)
})

// 4. Gestion d'erreurs
try {
  const response = await fetch(...);
  const data = await response.json();
  if (data.success) { /* traiter */ }
  else { showNotification(data.message, 'error'); }
} catch (error) {
  showNotification('Erreur réseau', 'error');
}

// 5. LocalStorage
localStorage.setItem('authToken', token);
localStorage.getItem('authToken');
localStorage.removeItem('authToken');
```

---

## 🚀 Backend - Patterns

### Express.js Setup

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);

// Écouter
app.listen(5000, () => console.log('Server running...'));
```

### Route Structure

```javascript
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { createHotel } from '../controllers/hotelController.js';

// Route protégée (Admin)
router.post('/', authenticateToken, isAdmin, createHotel);

// Flux :
// Requête → authenticateToken → isAdmin → createHotel → Response
```

### Model Pattern

```javascript
class Hotel {
  // Statique = sans instance
  static async findById(id) {
    const sql = 'SELECT * FROM hotels WHERE id = ?';
    return await queryOne(sql, [id]);
  }

  static async create(nom, ville, description, prix) {
    const sql = 'INSERT INTO hotels (...) VALUES (?, ?, ?, ?)';
    const result = await execute(sql, [nom, ville, description, prix]);
    return { id: result.insertId };
  }
}

// Utilisation
const hotel = await Hotel.findById(1);
const newHotel = await Hotel.create(nom, ville, desc, prix);
```

---

## 🧪 Tests manuels

### Scénario complet

```bash
# 1. Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@ci.com","password":"pass123"}'
# → Récupérer le TOKEN

# 2. Rechercher des hôtels
curl http://localhost:5000/api/hotels/search?ville=Abidjan

# 3. Créer une réservation (avec TOKEN)
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"hotel","item_id":1,"date_debut":"2026-04-01"...}'

# 4. Voir ses réservations
curl http://localhost:5000/api/reservations/user/1 \
  -H "Authorization: Bearer TOKEN"
```

---

## 📈 Améliorations futures

### Priorité haute
- [ ] Paiement Mobile Money
- [ ] Notification email
- [ ] Dashboard admin
- [ ] Upload d'images

### Priorité moyenne
- [ ] Système de rating
- [ ] Commentaires utilisateurs
- [ ] Favoris/Wishlist
- [ ] Multi-langue

### Priorité basse
- [ ] Application mobile
- [ ] Intégration Google Maps
- [ ] Chat support
- [ ] Analytics avancées

---

## 🐛 Débogage

### Logs
```javascript
// Console
console.log('Debug:', variable);
console.error('Erreur:', error);

// SQL
console.log('Query:', sql);
console.log('Params:', params);
```

### Chrome DevTools
```
F12 → Network → Voir requêtes
F12 → Console → Messages d'erreur
F12 → Application → Storage/Cookies/Token
```

### MySQL
```sql
-- Vérifier les données
SELECT * FROM users;
SELECT * FROM reservations;

-- Déboguer les jointures
SELECT r.*, u.nom FROM reservations r
JOIN users u ON r.user_id = u.id;
```

---

## 📋 Checklist déploiement

- [ ] Changer JWT_SECRET en production
- [ ] Configurer CORS pour le domaine réel
- [ ] Ajouter HTTPS
- [ ] Configurer les logs
- [ ] Sauvegarder la base de données
- [ ] Tester tous les endpoints
- [ ] Vérifier la gestion d'erreurs
- [ ] Ajouter un rate limiter
- [ ] Documenter les changements
- [ ] Monitorer les performances

---

## 🎓 Ressources pour apprendre

- **Express.js** : https://expressjs.com/
- **Async/Await** : https://javascript.info/async-await
- **JWT** : https://jwt.io/
- **REST API** : https://restfulapi.net/
- **MySQL** : https://dev.mysql.com/doc/

---

**Bonne chance pour votre L3! 🚀**
