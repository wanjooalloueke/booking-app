# 🚀 DÉMARRAGE EN 5 MINUTES

## Si vous êtes pressé, voici le strict minimum!

### Prérequis
- Node.js installé
- MySQL démarré (XAMPP, WAMP, ou terminal)

---

## ⚡ Étape 1 : Installer

```bash
npm install
```

**Durée : ~2 minutes**

---

## ⚡ Étape 2 : Base de données

**Option A - Via phpMyAdmin (facile)**
1. Ouvrir http://localhost/phpmyadmin
2. Créer BDD : `CREATE DATABASE booking_app;`
3. Importer : database/schema.sql

**Option B - Via terminal (pro)**
```bash
mysql -u root -p
CREATE DATABASE booking_app;
USE booking_app;
SOURCE database/schema.sql;
EXIT;
```

**Durée : ~1 minute**

---

## ⚡ Étape 3 : Configuration

Ouvrir `.env` et vérifier (adapter si besoin) :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=booking_app
PORT=5000
```

**Durée : 30 secondes**

---

## ⚡ Étape 4 : Lancer

```bash
npm run dev
```

Vous verrez :
```
╔════════════════════════════════════╗
║   Booking.CI API Server             ║
║   Port: 5000                       ║
║   Environnement: development       ║
╚════════════════════════════════════╝

🚀 Serveur démarré sur http://localhost:5000
```

**Durée : 10 secondes**

---

## ⚡ Étape 5 : Tester

Ouvrir dans le navigateur :
```
http://localhost:5000/frontend/index.html
```

Et voilà! 🎉

---

## 🧪 Fonctionner rapidement

1. **S'inscrire** : Cliquer CONNEXION → Inscription
2. **Rechercher** : Sélectionner Abidjan → Cliquer Rechercher
3. **Réserver** : Cliquer Réserver → Confirmation
4. **Voir réservations** : Menu RÉSERVATION

---

## ❌ Si ça ne marche pas

### Erreur : Cannot find module 'express'
```bash
npm install
```

### Erreur : MySQL connection refused
```
✓ MySQL démarré et lancé?
✓ Identifiants corrects dans .env?
✓ BDD 'booking_app' créée?
```

### Erreur : Port 5000 déjà utilisé
```
Changer dans .env : PORT=3000
```

### Erreur : 404 sur http://localhost:5000/frontend
```
Essayer: http://localhost:5000/frontend/index.html
```

---

## 📚 Après avoir démarré

- Lire `README.md` pour la doc complète
- Lire `GUIDE_INSTALLATION.md` pour plus de détails
- Lire `API_DOCUMENTATION.md` pour les endpoints
- Lire `NOTES_DEVELOPPEMENT.md` pour comprendre l'architecture
- Lire `RESUME_COMPLET.md` pour avoir une vue d'ensemble

---

## 🎓 Bonne chance! 🚀

Vous avez une application PROFESSIONNELLE et COMPLÈTE prête à être utilisée.

Explorez le code, modifiez-le, améliorez-le!
