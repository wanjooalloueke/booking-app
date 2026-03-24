# 🚀 GUIDE DE CONNEXION À MYSQL AVEC XAMPP

## ✅ Prérequis

- ✅ XAMPP installé (déjà fait)
- ✅ Configuration stockée dans `.env`
- ✅ Script SQL prêt dans `database/schema.sql`

---

## 🎯 ÉTAPE 1 : Démarrer XAMPP

### Depuis le Control Panel XAMPP :

1. **Ouvrez XAMPP Control Panel**
2. **Cliquez sur "Start"** à côté de MySQL
   - Vous devriez voir : `MySQL: Running on port 3306`

### Vérification :

```bash
# Dans PowerShell
mysql -u root -password=""
# Vous devriez voir le prompt MySQL >
# Tapez 'exit' pour quitter
```

---

## 🎯 ÉTAPE 2 : Initialiser la Base de Données

### Méthode A : PhpMyAdmin (Interface graphique - Recommandée)

1. **Ouvrez votre navigateur**
2. **Allez sur** : http://localhost/phpmyadmin
3. **Cliquez sur "Importer"** en haut du menu
4. **Sélectionnez le fichier** : `booking-app/database/schema.sql`
5. **Cliquez sur "Exécuter"**
6. ✅ La base de données est créée !

### Méthode B : Ligne de commande (Terminal)

```bash
# Ouvrez PowerShell et allez dans le dossier du projet
cd "c:\Users\W_JOO ALK\Desktop\Projet app\booking-app"

# Exécutez le script SQL
mysql -u root < database\schema.sql

# Vous devriez voir :
# "Base de données Booking.CI initialisée avec succès!"
```

### Méthode C : Si mot de passe MySQL

```bash
# Avec mot de passe
mysql -u root -pVOTRE_MOT_DE_PASSE < database\schema.sql
```

---

## 🔍 ÉTAPE 3 : Vérifier la Base de Données

### Via PhpMyAdmin :

1. **Allez sur** : http://localhost/phpmyadmin
2. **Dans le menu gauche**, cherchez : `booking_app` (base de données) 
3. **Cliquez dessus**
4. Vous devriez voir :
   - ✅ Table `users` - 4 utilisateurs
   - ✅ Table `hotels` - 7 hôtels
   - ✅ Table `restaurants` - 9 restaurants
   - ✅ Table `reservations` - Vide (normal)

### Via ligne de commande :

```bash
# Connectez-vous à MySQL
mysql -u root

# Exécutez ces commandes :
USE booking_app;
SELECT COUNT(*) as nombre_hotels FROM hotels;
SELECT COUNT(*) as nombre_restaurants FROM restaurants;
SELECT COUNT(*) as nombre_utilisateurs FROM users;
EXIT;
```

---

## 📋 ÉTAPE 4 : Configuration de l'Application

Le fichier `.env` est déjà configuré :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=booking_app
DB_PORT=3306
```

### Si vous avez un mot de passe MySQL :

**Modifiez le fichier `.env`** :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_ici
DB_NAME=booking_app
DB_PORT=3306
```

---

## 🚀 ÉTAPE 5 : Démarrer l'Application

### Terminal 1 - Backend Node.js

```bash
# Allez dans le dossier backend
cd "c:\Users\W_JOO ALK\Desktop\Projet app\booking-app\backend"

# Installez les dépendances (première fois seulement)
npm install

# Démarrez le serveur
npm start

# Vous devriez voir :
# ✅ Connecté à la base de données MySQL
# ✅ Serveur lancé sur le port 5000
```

### Terminal 2 - Frontend

```bash
# Allez dans le dossier frontend
cd "c:\Users\W_JOO ALK\Desktop\Projet app\booking-app\frontend"

# Continuez le serveur (si pas déjà lancé)
python -m http.server 8000
```

---

## 🌐 ÉTAPE 6 : Accéder à l'Application

- **Frontend** : http://localhost:8000
- **Backend API** : http://localhost:5000

### Testez les API :

```bash
# Récupérer tous les hôtels
curl http://localhost:5000/api/hotels

# Récupérer les hôtels d'Abidjan
curl "http://localhost:5000/api/hotels/search?ville=Abidjan"

# Récupérer tous les restaurants
curl http://localhost:5000/api/restaurants
```

---

## ⚠️ DÉPANNAGE

### Erreur : "Access denied for user 'root'"

**Solution** : 
1. Vérifiez le mot de passe dans `.env`
2. Si XAMPP ne demande pas de mot de passe, laissez `DB_PASSWORD=` vide

### Erreur : "Unknown database 'booking_app'"

**Solution** :
1. Réexécutez le script SQL
2. Vérifiez dans PhpMyAdmin que `booking_app` existe

### Erreur : "MySQL server has gone away"

**Solution** :
1. Vérifiez que MySQL est démarré dans XAMPP
2. Redémarrez le serveur Node.js

### Erreur : "ECONNREFUSED 127.0.0.1:3306"

**Solution** :
1. MySQL n'est pas démarré
2. Cliquez sur "Start" pour MySQL dans XAMPP Control Panel

---

## 📊 Données de Démo

### Utilisateurs créés :
- **admin@booking.ci** (Admin)
- **client@booking.ci** (Client)
- **marie@booking.ci** (Client)
- **jean@booking.ci** (Client)

### Hôtels par ville :
- **Abidjan** : 4 hôtels (85k-120k FCFA)
- **Yamoussoukro** : 1 hôtel (45k FCFA)
- **Bouaké** : 1 hôtel (55k FCFA)
- **San-Pédro** : 1 hôtel (65k FCFA)

### Restaurants par ville :
- **Abidjan** : 4 restaurants (8.5k-18k FCFA)
- **Yamoussoukro** : 1 restaurant (9k FCFA)
- **Bouaké** : 2 restaurants (8k-11k FCFA)
- **San-Pédro** : 2 restaurants (15k-16.5k FCFA)

---

## ✅ Checklist Finale

- [ ] MySQL démarré dans XAMPP
- [ ] Script SQL exécuté
- [ ] Base de données vérifiée
- [ ] `.env` configuré correctement
- [ ] Node.js et npm installés
- [ ] Backend démarré (`npm start`)
- [ ] Frontend accessible
- [ ] API testée
- [ ] ✅ Application fonctionnelle !

---

## 🎉 Succès !

Votre application Booking.CI est maintenant entièrement connectée à MySQL !

Toutes les données du formulaire seront sauvegardées dans la base de données.