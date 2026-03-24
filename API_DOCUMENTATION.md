# 📚 DOCUMENTATION API COMPLÈTE - Booking.CI

## 🎯 Base URL
```
http://localhost:5000/api
```

---

## 🔐 AUTHENTIFICATION

### 1. Inscription - POST /auth/register

Créer un nouveau compte utilisateur.

**URL:** `POST /api/auth/register`

**Body (JSON):**
```json
{
  "nom": "Jean Dupont",
  "email": "jean@example.ci",
  "password": "monMotDePasse123"
}
```

**Réponse Succès (201):**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Jean Dupont",
    "email": "jean@example.ci",
    "role": "client"
  }
}
```

**Erreurs:**
```json
{
  "success": false,
  "message": "Tous les champs sont requis"
}
```

---

### 2. Connexion - POST /auth/login

Se connecter avec ses identifiants.

**URL:** `POST /api/auth/login`

**Body (JSON):**
```json
{
  "email": "jean@example.ci",
  "password": "monMotDePasse123"
}
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Jean Dupont",
    "email": "jean@example.ci",
    "role": "client"
  }
}
```

**Erreurs:**
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

---

### 3. Vérifier Token - GET /auth/verify

Vérifier la validité du JWT token.

**URL:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer <votre_token>
Content-Type: application/json
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nom": "Jean Dupont",
    "email": "jean@example.ci",
    "role": "client"
  }
}
```

---

## 🏨 HÔTELS

### 1. Lister tous les hôtels - GET /hotels

Récupérer la liste des hôtels avec pagination.

**URL:** `GET /api/hotels`

**Paramètres Query:**
```
?page=1&limit=20
```

**Exemple:** `GET /api/hotels?page=1&limit=10`

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "Hôtel Ivoire",
      "ville": "Abidjan",
      "description": "Hôtel 5 étoiles avec vue sur la lagune",
      "prix": 85000,
      "disponibilite": 1,
      "image": "🏨",
      "note": 4.8,
      "nombre_avis": 234,
      "date_creation": "2026-03-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "count": 5
  }
}
```

---

### 2. Rechercher des hôtels - GET /hotels/search

Rechercher des hôtels selon des critères.

**URL:** `GET /api/hotels/search`

**Paramètres Query:**
```
?ville=Abidjan&prixMin=50000&prixMax=100000&disponibilite=1
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nom": "Hôtel Ivoire",
      "ville": "Abidjan",
      "prix": 85000,
      ...
    }
  ],
  "count": 1
}
```

---

### 3. Récupérer un hôtel - GET /hotels/:id

Récupérer les détails complets d'un hôtel.

**URL:** `GET /api/hotels/1`

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nom": "Hôtel Ivoire",
    "ville": "Abidjan",
    "description": "Hôtel 5 étoiles avec vue sur la lagune",
    "prix": 85000,
    "disponibilite": 1,
    "image": "🏨",
    "note": 4.8,
    "nombre_avis": 234
  }
}
```

---

### 4. Créer un hôtel - POST /hotels (Admin)

Créer un nouvel hôtel.

**URL:** `POST /api/hotels`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "nom": "Pullman Abidjan",
  "ville": "Abidjan",
  "description": "Hôtel 4 étoiles modernes",
  "prix": 95000,
  "disponibilite": 1,
  "image": "🏨"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Hôtel créé avec succès",
  "data": {
    "id": 6,
    "nom": "Pullman Abidjan",
    "ville": "Abidjan",
    "prix": 95000
  }
}
```

---

### 5. Mettre à jour un hôtel - PUT /hotels/:id (Admin)

Modifier les informations d'un hôtel.

**URL:** `PUT /api/hotels/1`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "prix": 90000,
  "description": "Mis à jour - 5 étoiles luxe"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Hôtel mis à jour avec succès"
}
```

---

### 6. Supprimer un hôtel - DELETE /hotels/:id (Admin)

Supprimer un hôtel.

**URL:** `DELETE /api/hotels/1`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Réponse:**
```json
{
  "success": true,
  "message": "Hôtel supprimé avec succès"
}
```

---

## 🍽️ RESTAURANTS

### Endpoints identiques aux hôtels

- `GET /api/restaurants` - Lister tous
- `GET /api/restaurants/search` - Rechercher
- `GET /api/restaurants/:id` - Détails
- `POST /api/restaurants` - Créer (Admin)
- `PUT /api/restaurants/:id` - Modifier (Admin)
- `DELETE /api/restaurants/:id` - Supprimer (Admin)

---

## 📅 RÉSERVATIONS

### 1. Créer une réservation - POST /reservations

Réserver un hôtel ou restaurant.

**URL:** `POST /api/reservations`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

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

**Réponse (201):**
```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "id": 15
  }
}
```

**Erreurs:**
```json
{
  "success": false,
  "message": "Cet élément n'est pas disponible pour ces dates"
}
```

---

### 2. Voir mes réservations - GET /reservations/user/:userId

Récupérer les réservations de l'utilisateur connecté.

**URL:** `GET /api/reservations/user/1`

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "user_id": 1,
      "type": "hotel",
      "item_id": 1,
      "date_debut": "2026-04-01",
      "date_fin": "2026-04-05",
      "nombre_personnes": 2,
      "statut": "confirmée",
      "date_creation": "2026-03-20T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 3. Récupérer une réservation - GET /reservations/:id

Récupérer les détails d'une réservation spécifique.

**URL:** `GET /api/reservations/15`

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "user_id": 1,
    "type": "hotel",
    "item_id": 1,
    "date_debut": "2026-04-01",
    "date_fin": "2026-04-05",
    "nombre_personnes": 2,
    "statut": "confirmée"
  }
}
```

---

### 4. Mettre à jour une réservation - PUT /reservations/:id

Modifier une réservation existante.

**URL:** `PUT /api/reservations/15`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "date_debut": "2026-04-02",
  "nombre_personnes": 3
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Réservation mise à jour avec succès"
}
```

---

### 5. Annuler une réservation - DELETE /reservations/:id

Annuler une réservation.

**URL:** `DELETE /api/reservations/15`

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "success": true,
  "message": "Réservation annulée avec succès"
}
```

---

### 6. Toutes les réservations - GET /reservations (Admin)

Récupérer toutes les réservations du système.

**URL:** `GET /api/reservations?page=1&limit=20`

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## ❌ Codes d'erreur HTTP

| Code | Signification |
|------|---------------|
| 200 | ✅ Succès |
| 201 | ✅ Créé avec succès |
| 400 | ❌ Requête invalide |
| 401 | ❌ Non authentifié |
| 403 | ❌ Accès refusé |
| 404 | ❌ Non trouvé |
| 409 | ❌ Conflit (ex: dates non disponibles) |
| 500 | ❌ Erreur serveur |

---

## 🧪 Tester avec cURL

### Enregistrement
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@ci","password":"password123"}'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ci","password":"password123"}'
```

### Récupérer les hôtels
```bash
curl -X GET http://localhost:5000/api/hotels
```

### Créer une réservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type":"hotel",
    "item_id":1,
    "date_debut":"2026-04-01",
    "date_fin":"2026-04-05",
    "nombre_personnes":2
  }'
```

---

## 🔑 Format du JWT Token

Les tokens JWT contiennent :

```json
{
  "id": 1,
  "email": "jean@example.ci",
  "role": "client",
  "iat": 1647770400,
  "exp": 1647856800
}
```

---

## 📋 Validation des données

### Utilisateur
- `nom` : Requis, max 100 caractères
- `email` : Requis, format valide, unique
- `password` : Requis, min 6 caractères

### Hôtel/Restaurant
- `nom` : Requis, max 150 caractères
- `ville` : Requis, max 100 caractères
- `prix` : Requis, en FCFA
- `description` : Optionnel, max 1000 caractères

### Réservation
- `type` : Requis (hotel ou restaurant)
- `item_id` : Requis, doit exister
- `date_debut` : Requis, format YYYY-MM-DD
- `date_fin` : Requis, doit être > date_debut
- `nombre_personnes` : Optionnel, défaut 1

---

## 🎓 Exemples d'utilisation

### Scénario 1 : Inscription et première réservation

```bash
# 1. Inscription
TOKEN=$(curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Marie","email":"marie@ci","password":"pass123"}' \
  | jq -r '.token')

# 2. Rechercher des hôtels
curl http://localhost:5000/api/hotels/search?ville=Abidjan

# 3. Réserver un hôtel
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"hotel",
    "item_id":1,
    "date_debut":"2026-04-001",
    "date_fin":"2026-04-05",
    "nombre_personnes":1
  }'
```

---

## 📞 Support

Pour toute question ou problème, consultez le README.md ou le guide d'installation.

**Dernière mise à jour:** 20 Mars 2026
