import express from "express";
import {
    getUtilisateurs,
    getUtilisateur,
    updateUtilisateur,
    createUtilisateur,
    deleteUtilisateur,
    login
} from "../controllers/utilisateur.Controller.js";

const router = express.Router();

router.get("/", getUtilisateurs);
router.get("/:id", getUtilisateur);
router.put("/:id", updateUtilisateur);
router.post("/", createUtilisateur);
router.delete("/:id", deleteUtilisateur);
router.post("/login", login);

export default router;