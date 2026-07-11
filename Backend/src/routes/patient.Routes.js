import express from "express";
import patientController from "../controllers/patient.Controller.js";
const router = express.Router();    

router.post("/",patientController.createPatient);
router.get("/",patientController.getAllPatient);
router.get("/:id",patientController.getPatientById);
router.put("/:id",patientController.updatePatient);
router.delete("/:id",patientController.deletePatient);

export default router;