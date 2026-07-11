import express from "express";
import salleController from "../controllers/salle.Controller.js";
const router = express.Router();

router.post("/",salleController.createSalle);
router.get("/",salleController.getAllSalles);
router.get("/:id",salleController.getSalleById);
router.put("/:id",salleController.updateSalle);
router.delete("/:id",salleController.deleteSalle);

export default router;