# ✅ CHECKLIST DE VÉRIFICATION

Utilisez cette liste pour vérifier que tout fonctionne correctement!

---

## AVANT DE DÉMARRER

- [ ] MySQL est lancé sur votre ordinateur
- [ ] Node.js est installé (vérifiez: `node -v`)
- [ ] npm est installé (vérifiez: `npm -v`)
- [ ] Vous êtes dans le dossier `booking-app`

---

## INSTALLATION

- [ ] Vous avez créé le dossier `booking-app`
- [ ] Tous les fichiers sont téléchargés dans `booking-app`
- [ ] Vous avez exécuté `npm install`
- [ ] Aucune erreur d'installation
- [ ] Le dossier `node_modules` a été créé

---

## BASE DE DONNÉES

- [ ] La base de données `booking_app` a été créée
- [ ] Les tables ont été créées (users, hotels, restaurants, reservations)
- [ ] Les données de test sont importées
- [ ] Vous pouvez vous connecter à MySQL avec vos identifiants

---

## CONFIGURATION

- [ ] Le fichier `.env` existe
- [ ] `DB_HOST=localhost`
- [ ] `DB_USER=votre_utilisateur_mysql`
- [ ] `DB_PASSWORD=votre_mot_de_passe_mysql`
- [ ] `DB_NAME=booking_app`
- [ ] `JWT_SECRET` est défini (quelque chose de long et aléatoire)
- [ ] `PORT=5000`

---

## DÉMARRAGE DU SERVEUR

- [ ] Vous avez exécuté `npm run dev`
- [ ] Aucun message d'erreur
- [ ] Vous voyez: "Serveur lancé sur http://localhost:5000"
- [ ] La console n'affiche pas d'erreurs de connexion BD

---

## VÉRIFICATION DE L'APPLICATION

### Frontend

- [ ] L'application charge dans le navigateur (http://localhost:5000/frontend/index.html)
- [ ] La page d'accueil s'affiche correctement
- [ ] La barre de navigation est visible
- [ ] Le titre "Bienvenue" apparaît
- [ ] La barre de recherche est visible
- [ ] Les hôtels et restaurants apparaissent
- [ ] Vous voyez au moins 5 hôtels et 5 restaurants
- [ ] Les prix sont en FCFA
- [ ] Les villes incluses sont: Abidjan, Yamoussoukro, Bouaké, San-Pédro

---

### Authentification

- [ ] Le bouton "Connexion" en haut à droite fonctionne
- [ ] La modal d'authentification s'ouvre
- [ ] Vous pouvez voir l'onglet "Connexion"
- [ ] Vous pouvez voir l'onglet "Inscription"
- [ ] Les champs de saisie sont visibles

**Test Connexion:**
- [ ] Email: `test@example.com`
- [ ] Mot de passe: `password123`
- [ ] Vous êtes connecté
- [ ] Le bouton change en "Se déconnecter"

**Test Inscription:**
- [ ] Vous pouvez taper un nouvel email
- [ ] Vous pouvez taper un nouveau mot de passe
- [ ] Le bouton "S'inscrire" fonctionne
- [ ] Vous recevez un message de succès
- [ ] Vous êtes connecté automatiquement

---

### Recherche

- [ ] Vous pouvez sélectionner une ville
- [ ] Vous pouvez sélectionner des dates
- [ ] Vous pouvez entrer un nombre de personnes
- [ ] Le bouton "Rechercher" fonctionne
- [ ] Les résultats s'affichent correctement

**Test spécifique:**
- [ ] Ville: Abidjan
- [ ] Date arrivée: (demain)
- [ ] Date départ: (dans 3 jours)
- [ ] Personnes: 2
- [ ] Recherche fonctionne ✅

---

### Réservation

- [ ] Vous êtes connecté
- [ ] Vous cliquez sur "Réserver" d'un hôtel/restaurant
- [ ] Une modal de réservation s'ouvre
- [ ] Les dates peuvent être sélectionnées
- [ ] Le nombre de personnes peut être entré
- [ ] Le bouton "Confirmer" fonctionne
- [ ] Vous recevez un message "Réservation confirmée!"
- [ ] La réservation est ajoutée à "Mon Historique"

---

### Administration (optionnel)

- [ ] Il existe un compte admin: `admin@example.com` / `admin123`
- [ ] Après connexion en tant qu'admin, des options supplémentaires apparaissent
- [ ] Vous pouvez créer un nouvel hôtel
- [ ] Vous pouvez modifier un hôtel existant
- [ ] Vous pouvez supprimer un hôtel
- [ ] Même pour les restaurants

---

## API (Test optionnel avec cURL)

Ouvrez un terminal séparé et testez:

```bash
# Vérifiez que l'API répond
curl http://localhost:5000/api/hotels

# Vous devriez voir une liste d'hôtels en JSON
```

- [ ] L'endpoint `/api/hotels` répond
- [ ] Les données sont au format JSON
- [ ] Les hôtels sont listés
- [ ] Les prix sont en FCFA

---

## CODE ET STRUCTURE

- [ ] Le dossier `frontend/` contient: `index.html`, `css/styles.css`, `js/app.js`
- [ ] Le dossier `backend/` contient les dossiers: `models/`, `controllers/`, `routes/`, `config/`, `middleware/`
- [ ] Le fichier `backend/server.js` existe
- [ ] Le fichier `database/schema.sql` existe
- [ ] Le fichier `package.json` existe
- [ ] Tous les fichiers de documentation existent

---

## DOCUMENTATION

- [ ] `README.md` existe et est lisible
- [ ] `START.md` existe et donne les étapes rapides
- [ ] `GUIDE_INSTALLATION.md` existe
- [ ] `API_DOCUMENTATION.md` existe
- [ ] `NOTES_DEVELOPPEMENT.md` existe
- [ ] Toutes les documentations sont en français

---

## TESTS DE ROBUSTESSE

**Test 1: Saisie invalide**
- [ ] Email sans @: pas d'inscriptionLe système refuse
- [ ] Mot de passe vide: pas d'inscription
- [ ] Email déjà utilisé: message d'erreur correctLe système refuse

**Test 2: Dates**
- [ ] Date passée: pas de réservation possible
- [ ] Date départ < date arrivée: erreur correcte
- [ ] Dates valides: réservation fonctionne

**Test 3: Multiple réservations**
- [ ] Réservez une chambre pour 2 personnes, 3 nuits
- [ ] Réservez la même chambre pour les mêmes dates avec un autre compte
- [ ] Le système refuse (déjà prise) ✅
- [ ] Réservez pour des dates différentes: OK ✅

---

## PERFORMANCE

- [ ] L'application se charge en < 2 secondes
- [ ] Les réservations se créent rapidement (< 1 seconde)
- [ ] Les recherches sont rapides
- [ ] Pas de lag lors du clic sur les boutons
- [ ] Les images chargent correctement

---

## SÉCURITÉ (Vérifications basiques)

- [ ] Les mots de passe ne s'affichent jamais
- [ ] Le JWT est stocké en localStorage
- [ ] Vous ne pouvez pas accéder aux réservations d'autrui
- [ ] Un admin peut voir tous les hôtels et tous les restaurants
- [ ] Le JWT_SECRET n'est pas dans le code frontend

---

## DESIGN ET UX

- [ ] L'application est responsive sur mobile (testez la console DevTools)
- [ ] Les couleurs correspondent (Orange, Bleu, Or)
- [ ] Le design est professionnel
- [ ] Pas de texte cassé
- [ ] Les boutons sont bien centrés
- [ ] Les modales se ferment correctement

---

## SI TOUT FONCTIONNE ✅

```
┌─────────────────────────────────────┐
│  BRAVO! VOUS AVEZ:                  │
│                                     │
│  ✅ Une app web professionnelle     │
│  ✅ Une base de données             │
│  ✅ Une API REST                    │
│  ✅ L'authentification               │
│  ✅ Des réservations                 │
│  ✅ Un design beau                  │
│  ✅ Une bonne architecture          │
│                                     │
│  VOUS ÊTES PRÊT POUR LES ÉTAPES     │
│  SUIVANTES!                         │
└─────────────────────────────────────┘
```

---

## SI QUELQUE CHOSE NE FONCTIONNE PAS ❌

1. **Vérifiez que le serveur est lancé**
   - `npm run dev` dans le terminal

2. **Vérifiez que MySQL est lancé**
   - Testez: `mysql -u root -p` (doit fonctionner)

3. **Vérifiez le fichier `.env`**
   - Les identifiants doivent correspondre à votre MySQL

4. **Vérifiez la console du navigateur**
   - Appuyez sur F12, allez dans l'onglet "Console"
   - Il y aura peut-être des indices sur l'erreur

5. **Vérifiez les logs du serveur**
   - Ils s'affichent dans le terminal où vous avez lancé `npm run dev`

6. **Lisez la documentation**
   - `GUIDE_INSTALLATION.md` a une section "Erreurs courantes"

---

## MESURES À PRENDRE APRÈS

- [ ] Lisez toute la documentation
- [ ] Comprenez l'architecture MVC
- [ ] Essayez de modifier quelque chose
- [ ] Créez un nouvel endpoint API
- [ ] Modifiez le design
- [ ] Ajoutez une nouvelle fonctionnalité
- [ ] Versionnez avec git: `git init` et `git add .`

---

```
Vous avez checklist? ✅
Tout fonctionne? ✅
Prêt à conquérir? 🚀

LET'S GO! 💪
```
