import express from "express";
import admissionController from "../controllers/admission.Controller.js";
const router = express.Router();

router.post("/",admissionController.createAdmission);
router.get("/",admissionController.getAllAdmission);
router.get("/:id",admissionController.getAdmissionById);
router.put("/:id",admissionController.updateAdmission);
router.delete("/:id",admissionController.deleteAdmission);


export default router;