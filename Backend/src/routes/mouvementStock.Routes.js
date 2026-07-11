import express from "express";
import {
    getMouvements,
    createMouvement,

} from "../controllers/mouvementStock.Controller.js";

const router = express.Router();

router.get("/", getMouvements);
router.post("/", createMouvement);

export default router;