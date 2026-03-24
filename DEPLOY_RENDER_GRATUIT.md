# Deploiement gratuit (Render) + developpement local

Ce guide te permet de garder ton projet modifiable en local et disponible en ligne en meme temps.

## 1) Solution recommandee gratuite

- Serveur: Render (plan free)
- Base de donnees MySQL: Railway (credits gratuits) ou autre MySQL cloud

Le code est deja prepare pour:
- local: frontend (Live Server) + backend localhost:5000
- production: frontend et backend sur le meme domaine Render

## 2) Preparer ton repo GitHub

1. Cree un repository GitHub et pousse ce projet.
2. Verifie que ces fichiers sont bien presents:
   - render.yaml
   - .env.example

## 3) Creer la base MySQL en ligne

Exemple Railway:
1. Cree un projet Railway
2. Ajoute un service MySQL
3. Recupere: host, port, database, user, password

## 4) Deployer sur Render

1. Va sur https://render.com et connecte ton GitHub
2. New + > Blueprint
3. Selectionne ton repository
4. Render detecte render.yaml et cree le service

## 5) Variables d'environnement Render

Dans Render > Environment, configure:

- BACKEND_URL=https://ton-app.onrender.com
- FRONTEND_URL=https://ton-app.onrender.com
- CORS_ORIGINS=https://ton-app.onrender.com
- DB_HOST=...
- DB_PORT=...
- DB_NAME=...
- DB_USER=...
- DB_PASSWORD=...
- JWT_SECRET=une-cle-secrete-forte
- JWT_EXPIRE=24

Si tu utilises OAuth:
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- FACEBOOK_APP_ID / FACEBOOK_APP_SECRET
- APPLE_* (optionnel)

## 6) Mettre a jour OAuth redirects

Dans Google/Facebook:
- https://ton-app.onrender.com/api/auth/google/callback
- https://ton-app.onrender.com/api/auth/facebook/callback

## 7) Continuer a coder en local tout en etant en ligne

Workflow conseille:
1. Tu developpes en local normalement
2. Tu commits/pushes sur GitHub
3. Render redeploie automatiquement

Commandes utiles:

```bash
git add .
git commit -m "maj fonctionnalite"
git push
```

## 8) Notes importantes

- Le plan free Render peut "dormir" (cold start)
- Ne mets jamais tes secrets dans le code
- Garde .env local pour ton dev, et variables Render pour la prod
