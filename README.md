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

Manohy Fanekena RANDRIANANTENAINA
Software Engineering Student
Full Stack MERN Developer
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

<img width="1881" height="930" alt="dash" src="https://github.com/user-attachments/assets/4c08c576-7c56-4512-a4f6-d8c75b971667" />

<img width="1897" height="972" alt="patient" src="https://github.com/user-attachments/assets/15a4412d-e71f-4367-90fc-d34918423953" />

<img width="1887" height="937" alt="medicament" src="https://github.com/user-attachments/assets/7087c6e1-cc32-4e12-bf9c-a1a8cb87e83b" />

<img width="1877" height="957" alt="mouvement" src="https://github.com/user-attachments/assets/289d5875-08ba-44b2-a0ea-0154ad0b448d" />

<img width="1907" height="935" alt="admission" src="https://github.com/user-attachments/assets/06f6f4b4-7533-4049-abf2-97de5fef20f2" />

<img width="1898" height="928" alt="alert" src="https://github.com/user-attachments/assets/a83a3e5d-8797-4024-b0f7-915c7bf2d8fb" />


---

## 🔮 Améliorations futures

- Authentification JWT
- Gestion des rôles
- Tableau de bord avec statistiques
- Notifications
- Version mobile

---

## 👥 Équipe

Projet réalisé dans le cadre d'un mini-projet universitaire.

Matière: MVC

annee universitaire: 2025 - 2026

IGGLIA3 : 

	RASOLOMANANA Andry Nomenjanahary Liantsoa 
	RAKOTOMALALA Manitrela Harivelo
	RANDRIANJAFY Jimmy Mamy Mickael
	RAZAFINDRATSIMA Ny Tsanta Fiorenana Fehizoro
	RAZAFINDRAIBE Nirintsoa Faneva
	RAMBONIARISOA Mathieu
	SETH Maholitiana Seann
	RATOVONDRIAKA Herihasitahina
	RANDRIANANTENAINA Manohy Fanekena
	ANDRIATOLOJANAHARY Misandratrarivo Tiavina

---

## 📄 Licence

Ce projet est distribué sous la licence MIT.
