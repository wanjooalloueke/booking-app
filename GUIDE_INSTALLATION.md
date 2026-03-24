# 🚀 GUIDE D'INSTALLATION RAPIDE - Booking.CI

## Windows

### Étape 1 : Installer les dépendances Node.js

```powershell
# Ouvrir PowerShell en tant qu'administrateur
cd "C:\Users\W_JOO ALK\Desktop\Projet app\booking-app"

# Installer les dépendances
npm install
```

### Étape 2 : Configurer MySQL

1. **Installer XAMPP** (si pas déjà installé)
   - Télécharger depuis https://www.apachefriends.org/
   - Installer et lancer XAMPP Control Panel
   - Démarrer Apache et MySQL

2. **Ouvrir phpMyAdmin**
   - Lancer XAMPP Control Panel
   - Cliquer sur "Admin" à côté de MySQL
   - Ou accéder à http://localhost/phpmyadmin/

3. **Créer la base de données**
   ```sql
   CREATE DATABASE booking_app;
   USE booking_app;
   ```

4. **Importer le schéma SQL**
   - Ouvrir l'onglet "Import"
   - Sélectionner le fichier `database/schema.sql`
   - Cliquer sur "Go"

### Étape 3 : Configurer les variables d'environnement

1. Ouvrir le fichier `.env`
2. Adapter les paramètres (les ports MySQL pourraient être différents)

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=booking_app
DB_PORT=3306
PORT=5000
```

### Étape 4 : Lancer l'application

```powershell
# Installer nodemon globalement (optionnel mais recommandé)
npm install -g nodemon

# Lancer en développement
npm run dev

# OU lancer en production
npm start
```

L'application démarre sur http://localhost:5000

### Étape 5 : Ouvrir dans le navigateur

```
Frontend: http://localhost:5000/frontend/index.html
API: http://localhost:5000/api
```

---

## macOS / Linux

### Même procédure que Windows, sauf :

```bash
# Installer Node.js avec Homebrew (macOS)
brew install node

# Installation sur Linux
sudo apt-get install nodejs npm

# Le reste est identique
cd ~/Desktop/booking-app
npm install
npm run dev
```

---

## Dépannage

### ❌ Erreur : "Cannot find module 'express'"
```powershell
# Solution :
npm install
```

### ❌ Erreur : "MySQL Connection Refused"
```
1. Vérifier que MySQL est démarré (XAMPP)
2. Vérifier les identifiants dans .env
3. Vérifier le port (3306 par défaut)
```

### ❌ Erreur : "Database 'booking_app' not found"
```sql
-- Créer la base de données
CREATE DATABASE booking_app;

-- Puis importer schema.sql
```

### ❌ Port 5000 déjà utilisé
```powershell
# Trouver le processus
netstat -ano | findstr :5000

# Changer le PORT dans .env
PORT=3000
```

---

## Comptes de test

Après avoir lancé l'application, vous pouvez vous inscrire ou utiliser les comptes de test.

### Inscription rapide

1. Cliquer sur "CONNEXION"
2. Aller à "Inscription"
3. Remplir les champs
4. Cliquer sur "S'inscrire"

### Identifiants admin (après insertion en BD)

```
Email: admin@Booking.CI.ci
Password: password123
```

---

## 📱 Tester les fonctionnalités

### 1. Recherche
- Sélectionner "Abidjan"
- Choisir des dates
- Cliquer "Rechercher"

### 2. Réservation
- Se connecter
- Cliquer "Réserver" sur une carte
- Voir la confirmation

### 3. Voir les réservations
- Se connecter
- Aller à "RÉSERVATION"
- Voir l'historique

---

## Backend - Endpoints de test

### Récupérer tous les hôtels
```
GET http://localhost:5000/api/hotels
```

### Se connecter
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "client@example.ci",
  "password": "password123"
}
```

### Créer une réservation
```
POST http://localhost:5000/api/reservations
Header: Authorization: Bearer <token>
Body: {
  "type": "hotel",
  "item_id": 1,
  "date_debut": "2026-04-01",
  "date_fin": "2026-04-05",
  "nombre_personnes": 2
}
```

---

## 🎯 Prochaines étapes

1. ✅ Application lancée
2. 🔄 Tester les fonctionnalités
3. 📝 Modifier les données
4. 🎨 Personnaliser le design
5. 🚀 Déployer en production

---

## 📞 Besoin d'aide ?

- Vérifier les logs en console
- Lire le README.md pour plus de détails
- Consulter la documentation API
- Vérifier que tous les services sont démarrés

**Bon développement! 🚀**
