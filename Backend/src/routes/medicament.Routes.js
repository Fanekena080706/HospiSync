import express from "express";
import {
    getMedicament,
    getMedicaments,
    createMedicament,
    deleteMedicament, 
    updateMedicament,
    getAlertesStock
 } from "../controllers/medicament.Controller.js";

 const router = express.Router();

 router.get("/", getMedicaments);
 router.get("/alertes", getAlertesStock);
 router.get("/:id", getMedicament);
 router.post("/", createMedicament);
 router.put("/:id", updateMedicament);
 router.delete("/:id", deleteMedicament);

 export default router;