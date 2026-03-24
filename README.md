# 📱 Booking.CI - Application de Réservation d'Hôtels et Restaurants

Application web moderne et professionnelle pour réserver des hôtels et restaurants en Côte d'Ivoire.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

</div>

## 🌟 Caractéristiques

### ✨ Frontend
- **Interface responsive** : Mobile, tablette, desktop
- **Design moderne** : Inspiré de Booking.com avec identité ivoirienne
- **Navigation intuitive** : 4 menus principaux (Hôtel, Restaurant, Réservation, Connexion)
- **Recherche avancée** : Par ville, dates et nombre de personnes
- **Cartes interactives** : Affichage des hôtels et restaurants
- **Système de notation** : Avis et notes des utilisateurs
- **Authentification** : Inscription et connexion sécurisées

### 🔧 Backend
- **API REST** : Architecture REST complète
- **Authentification JWT** : Tokens sécurisés et expirables
- **Hashage sécurisé** : Mot de passe avec bcrypt
- **Gestion des rôles** : Admin et client
- **Validation des données** : Sécurité maximale
- **CORS activé** : Communication frontend ↔ backend

### 💾 Base de données
- **MySQL** : Base de données relationnelle
- **Tables normalisées** : Utilisateurs, hôtels, restaurants, réservations
- **Index optimisés** : Recherches rapides
- **Contraintes d'intégrité** : Données cohérentes

### 💰 Spécificités Côte d'Ivoire
- **Prix en FCFA** : Tarification locale
- **Villes principales** : Abidjan, Yamoussoukro, Bouaké, San-Pédro
- **Prêt pour Mobile Money** : Architecture compatible paiement mobile

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Bonnes pratiques](#bonnes-pratiques)

## 🚀 Installation

### Prérequis

- **Node.js** (version 14+)
- **MySQL** (version 5.7+)
- **npm** ou **yarn**

### Étape 1 : Préparation

```bash
# Cloner ou télécharger le projet
cd booking-app

# Installer les dépendances
npm install
```

### Étape 2 : Configuration de la base de données

```bash
# 1. Ouvrir MySQL
mysql -u root -p

# 2. Créer la base de données
CREATE DATABASE booking_app;
USE booking_app;

# 3. Exécuter le script SQL
source database/schema.sql;
```

### Étape 3 : Variables d'environnement

```bash
# Copier le fichier .env.example
cp .env.example .env

# Éditer .env avec vos paramètres
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=booking_app
# PORT=5000
# JWT_SECRET=votre_clé_secrète_longue
```

### Étape 4 : Lancer l'application

```bash
# Mode développement (avec auto-rechargement)
npm run dev

# OU Mode production
npm start
```

L'application sera accessible sur `http://localhost:5000`

## ⚙️ Configuration

### Fichier .env

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=booking_app
DB_PORT=3306

# Serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24
```

### Permissions MySQL

```sql
-- Créer un utilisateur dédié (optionnel)
CREATE USER 'booking_user'@'localhost' IDENTIFIED BY 'booking_password';
GRANT ALL PRIVILEGES ON booking_app.* TO 'booking_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📱 Utilisation

### Accès à l'application

1. **Frontend** : Ouvrir un navigateur sur `http://localhost:5000/frontend/index.html`
2. **API** : `http://localhost:5000/api`

### Fonctionnalités principales

#### 1. Inscription
```
1. Cliquer sur "CONNEXION"
2. Sélectionner l'onglet "Inscription"
3. Remplir les champs
4. Confirmer le mot de passe
5. Cliquer sur "S'inscrire"
```

#### 2. Connexion
```
1. Cliquer sur "CONNEXION"
2. Entrer vos identifiants
3. Cliquer sur "Se connecter"
```

#### 3. Rechercher des établissements
```
1. Sélectionner une ville (Abidjan, Yamoussoukro, etc.)
2. Choisir les dates d'arrivée et départ
3. Spécifier le nombre de personnes
4. Cliquer sur "Rechercher"
```

#### 4. Réserver
```
1. Cliquer sur "Réserver" sur une carte
2. Confirmer les informations
3. Recevoir une confirmation
```

#### 5. Voir ses réservations
```
1. Se connecter
2. Aller à l'onglet "RÉSERVATION"
3. Consulter l'historique
```

## 📁 Structure du projet

```
booking-app/
├── frontend/                      # Interface utilisateur
│   ├── index.html                 # Page d'accueil
│   ├── css/
│   │   └── styles.css             # Styles responsifs
│   └── js/
│       └── app.js                 # Logique frontend
│
├── backend/                       # Serveur Node.js + Express
│   ├── server.js                  # Point d'entrée
│   ├── config/
│   │   └── database.js            # Configuration MySQL
│   ├── controllers/               # Logique métier
│   │   ├── authController.js      # Authentification
│   │   ├── hotelController.js     # Gestion hôtels
│   │   ├── restaurantController.js# Gestion restaurants
│   │   └── reservationController.js# Gestion réservations
│   ├── models/                    # Modèles de données
│   │   ├── User.js                # Utilisateur
│   │   ├── Hotel.js               # Hôtel
│   │   ├── Restaurant.js          # Restaurant
│   │   └── Reservation.js         # Réservation
│   ├── routes/                    # Définition des routes
│   │   ├── authRoutes.js          # Routes auth
│   │   ├── hotelRoutes.js         # Routes hôtels
│   │   ├── restaurantRoutes.js    # Routes restaurants
│   │   └── reservationRoutes.js   # Routes réservations
│   └── middleware/
│       └── auth.js                # JWT + authentification
│
├── database/
│   └── schema.sql                 # Schéma MySQL
│
├── package.json                   # Dépendances Node
├── .env.example                   # Variables d'environnement
└── README.md                      # Documentation

```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentification

#### POST /auth/register
Inscrire un nouvel utilisateur

**Body:**
```json
{
  "nom": "Jean Dupont",
  "email": "jean@example.ci",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Jean Dupont",
    "email": "jean@example.ci",
    "role": "client"
  }
}
```

#### POST /auth/login
Se connecter

**Body:**
```json
{
  "email": "jean@example.ci",
  "password": "password123"
}
```

#### GET /auth/verify
Vérifier le token (Nécessite Authorization header)

**Header:**
```
Authorization: Bearer <token>
```

### Hôtels

#### GET /hotels
Récupérer tous les hôtels

**Paramètres:**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre par page (défaut: 20)

#### GET /hotels/search
Rechercher des hôtels

**Paramètres:**
- `ville` : Nom de la ville
- `prixMin` : Prix minimum
- `prixMax` : Prix maximum
- `disponibilite` : 0 ou 1

#### GET /hotels/:id
Récupérer les détails d'un hôtel

#### POST /hotels (Admin)
Créer un hôtel

**Body:**
```json
{
  "nom": "New Hotel",
  "ville": "Abidjan",
  "description": "Description...",
  "prix": 100000,
  "disponibilite": 1,
  "image": "🏨"
}
```

### Restaurants

Même structure que les hôtels

#### GET /restaurants
#### GET /restaurants/search
#### GET /restaurants/:id
#### POST /restaurants (Admin)
#### PUT /restaurants/:id (Admin)
#### DELETE /restaurants/:id (Admin)

### Réservations

#### POST /reservations
Créer une réservation

**Body:**
```json
{
  "type": "hotel",
  "item_id": 1,
  "date_debut": "2026-04-01",
  "date_fin": "2026-04-05",
  "nombre_personnes": 2
}
```

#### GET /reservations/user/:userId
Récupérer les réservations d'un utilisateur

#### GET /reservations/:id
Récupérer une réservation

#### PUT /reservations/:id
Mettre à jour une réservation

#### DELETE /reservations/:id
Annuler une réservation

## 🔒 Sécurité

### Bonnes pratiques implémentées

1. **Hashage des mots de passe**
   - Utilisation de bcryptjs
   - Salt de 10 rounds
   - Mots de passe jamais stockés en clair

2. **JWT Tokens**
   - Tokens expirables (24h par défaut)
   - Signature sécurisée
   - Vérification stricte

3. **Validation des données**
   - Validation des emails
   - Vérification des longueurs
   - Validation des formats

4. **Contrôle d'accès**
   - Authentification obligatoire pour certains endpoints
   - Vérification des rôles (client vs admin)
   - Isolation des données utilisateur

5. **CORS**
   - Configuration pour éviter les accès non autorisés
   - Headers de sécurité (Helmet.js)

## 🛠️ Maintenance

### Logs
```bash
# Les logs sont affichés dans la console
# Structure: [TIMESTAMP] METHOD PATH
```

### Monitoring
```bash
# Vérifier que le serveur fonctionne
curl http://localhost:5000/api
```

### Sauvegarde de la base de données
```bash
mysqldump -u root -p booking_app > backup.sql
```

### Restauration
```bash
mysql -u root -p booking_app < backup.sql
```

## 📦 Dépendances

### Backend
- **express** : Framework web
- **mysql2** : Driver MySQL
- **bcryptjs** : Hashage des mots de passe
- **jsonwebtoken** : Gestion JWT
- **cors** : CORS middleware
- **helmet** : Sécurité HTTP
- **dotenv** : Variables d'environnement
- **body-parser** : Parser JSON

### Développement
- **nodemon** : Auto-rechargement

## 🚀 Déploiement

### Sur Heroku

```bash
# 1. Créer une application
heroku create booking-app-ci

# 2. Ajouter MySQL (ClearDB)
heroku addons:create cleardb:ignite

# 3. Déployer
git push heroku main
```

### Sur un serveur VPS

```bash
# 1. Installer Node.js et MySQL
# 2. Cloner le projet
# 3. Configurer .env
# 4. Installer les dépendances
# 5. Utiliser PM2 pour la persistance

npm install -g pm2
pm2 start backend/server.js
pm2 startup
pm2 save
```

## 📞 Support et Améliorations Futures

### Améliorations envisagées

- [ ] Intégration paiement Mobile Money
- [ ] Notifications email
- [ ] Système de notation et avis
- [ ] Dashboard admin complet
- [ ] Historique des réservations
- [ ] Annulation avec remboursement
- [ ] Multi-langue (FR/EN)
- [ ] Géolocalisation
- [ ] Intégration WhatsApp
- [ ] Application mobile (React Native)

## 👨‍💼 Auteur

Développé pour les étudiants L3 Informatique - Côte d'Ivoire

## 📜 Licence

MIT License - Vous êtes libre de modifier et distribuer ce projet

## 🎓 Ressources d'apprentissage

- [Documentation Express.js](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/)
- [Bcrypt Guide](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

<div align="center">

💡 **Conseil** : N'oubliez pas de changer la clé JWT_SECRET en production!

Made with ❤️ for Côte d'Ivoire

</div>
