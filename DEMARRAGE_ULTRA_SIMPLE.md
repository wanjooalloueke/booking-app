# ⚡ DÉMARRAGE ULTRA SIMPLE

**Vous ne savez pas par où commencer? Voici!**

---

## ÉTAPE 1: Ouvrez un Terminal

Windows: Win + R → `cmd` → Enter
Mac: Command + Espace → `terminal` → Enter
Linux: Ctrl + Alt + T

---

## ÉTAPE 2: Allez dans le dossier du projet

```bash
cd "C:\Users\W_JOO ALK\Desktop\Projet app\booking-app"
```

(Adaptez le chemin si différent)

---

## ÉTAPE 3: Lancez ceci

```bash
npm install
```

Attendez ~30 secondes. Si ça fini avec "added X packages", c'est bon! ✅

---

## ÉTAPE 4: Ouvrez MySQL

Lancez l'application MySQL qui est sur votre ordinateur.

Connectez-vous avec:
- Username: root
- Password: votre password MySQL

---

## ÉTAPE 5: Dans MySQL, tapez:

```sql
CREATE DATABASE booking_app;
USE booking_app;
SOURCE "C:\Users\W_JOO ALK\Desktop\Projet app\booking-app\database\schema.sql";
```

Attendez ~5 secondes. Si pas d'erreur, c'est bon! ✅

---

## ÉTAPE 6: Modifiez le fichier `.env`

Ouvrez le fichier `.env` dans le dossier du projet avec un éditeur de texte.

Remplacez:
```
DB_PASSWORD=votre_mot_de_passe_mysql
```

Par votre VRAI mot de passe MySQL.

Sauvegardez. ✅

---

## ÉTAPE 7: Retour au Terminal

Tapez:
```bash
npm run dev
```

Vous devriez voir:
```
✅ Serveur lancé sur http://localhost:5000
✅ Connecté à la base de données
```

---

## ÉTAPE 8: Ouvrez votre Navigateur

Collez dans la barre d'adresse:
```
http://localhost:5000/frontend/index.html
```

Et voilà! 🎉

---

## TEST RAPIDE

1. Cliquez "Connexion"
2. Email: test@example.com
3. Password: password123
4. Cliquez "Connexion"
5. Vous êtes connecté? ✅ Succès!

---

## C'EST TOUT!

Vous avez lancé une application web professionnelle!

Maintenant:
- Explorez l'app
- Lisez PRET_A_COMMENCER.md pour plus d'infos
- Lisez README.md pour comprendre

---

## SI QUELQUE CHOSE NE VA PAS

1. Vérifiez MySQL est lancé
2. Vérifiez la password dans .env est correcte
3. Regardez les messages d'erreur dans le terminal
4. Lisez CHECKLIST_VERIFICATION.md

---

## 🎉 BRAVO!

Vous avez une application web fonctionnelle!
