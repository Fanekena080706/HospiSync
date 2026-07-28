# 🏥 HospiSync

HospiSync est une application web de gestion hospitalière développée avec la stack MERN (MongoDB, Express.js, React.js et Node.js).

L'application permet de gérer les patients, les salles d'hospitalisation, les admissions ainsi que le stock des médicaments à travers une interface simple et intuitive.

---

## 📌 Fonctionnalités

### 👨‍⚕️ Gestion des patients

- Ajouter un patient
- Modifier les informations d'un patient
- Supprimer un patient
- Recherche rapide

### 🏥 Gestion des salles

- Création des salles
- Modification des salles
- Suivi de la capacité
- Gestion des lits disponibles

### 📋 Gestion des admissions

- Admission d'un patient
- Affectation à une salle disponible
- Mise à jour du statut
- Historique des admissions

### 💊 Gestion des médicaments

- Ajout des médicaments
- Modification
- Suppression (si aucun mouvement n'existe)
- Suivi des quantités

### 📦 Gestion du stock

- Entrée de stock
- Sortie de stock
- Mise à jour automatique des quantités
- Historique des mouvements

---

## 🚀 Technologies utilisées

### Frontend

- React.js
- CSS
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs

---

## 📂 Architecture

```
HospiSync

frontend/
    src/
        components/
        pages/
        services/
        assets/

backend/
    controllers/
    models/
    routes/
    config/
    middleware/
    server.js
```

Architecture : **MVC + REST API**

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Fanekena080706/HospiSync.git
```

### 2. Installer les dépendances

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

### 3. Variables d'environnement

Créer un fichier `.env` dans le dossier backend.

Exemple :

```env
PORT=5000
MONGO_URI=votre_url_mongodb
```

### 4. Lancer le backend

```bash
npm run dev
```

### 5. Lancer le frontend

```bash
npm start
```

---

## 📸 Captures d'écran

À compléter avec des captures de l'application.

---

## 🔮 Améliorations futures

- Authentification JWT
- Gestion des rôles
- Tableau de bord avec statistiques
- Notifications
- Version mobile

---

## 👥 Équipe

Projet réalisé dans le cadre d'un projet universitaire.

---

## 📄 Licence

Ce projet est distribué sous la licence MIT.
