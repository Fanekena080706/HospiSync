import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connexionDB from "./config/database.js";

import medicamentRoutes from "./routes/medicament.Routes.js";
import mouvementStockRoutes from "./routes/mouvementStock.Routes.js";
import utilisateurRoutes from "./routes/utilisateur.Routes.js"

dotenv.config();

// Connexion à MongoDB
connexionDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API Gestion Hôpital",
        status: "En ligne"
    });
});

// Routes
// app.use("/api/patients", patientRoutes);
// app.use("/api/salles", salleRoutes);
// app.use("/api/admissions", admissionRoutes);
app.use("/api/medicaments", medicamentRoutes);
app.use("/api/mouvements", mouvementStockRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});