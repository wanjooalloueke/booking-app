# Installation de l'environnement de développement

## Prérequis à installer :

### 1. Node.js (avec npm)
- Téléchargez depuis : https://nodejs.org/
- Version recommandée : LTS (18.x ou 20.x)
- Après installation, vérifiez avec :
```bash
node --version
npm --version
```

### 2. MySQL Server
- Téléchargez depuis : https://dev.mysql.com/downloads/mysql/
- OU utilisez XAMPP : https://www.apachefriends.org/
- Configurez avec :
  - Host: 127.0.0.1 (localhost)
  - Port: 3306
  - User: root
  - Password: (vide ou votre mot de passe)

### 3. Installation des dépendances

Une fois Node.js installé :

```bash
cd "c:\Users\W_JOO ALK\Desktop\Projet app\booking-app"
npm install
```

### 4. Configuration de la base de données

1. Créez la base de données :
```sql
CREATE DATABASE booking_app;
```

2. Exécutez le script SQL :
```bash
mysql -u root -p booking_app < database/schema.sql
```

### 5. Démarrage de l'application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (serveur de développement)
cd frontend
npx serve . -p 3000
```

### 6. Accès à l'application

- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

## Alternative rapide (sans MySQL)

Si vous voulez tester rapidement sans installer MySQL, je peux modifier temporairement l'application pour utiliser des données JSON locales.</content>
<parameter name="filePath">c:\Users\W_JOO ALK\Desktop\Projet app\INSTALLATION.md