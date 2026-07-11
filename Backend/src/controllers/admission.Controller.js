import Admission from "../models/Admission.js";
import Patient from "../models/Patient.js";
import Salle from "../models/Salle.js";

class AdmissionController {
  async getAllAdmission(req, res) {
    try {
      const admission = await Admission.find().sort({ nom: 1 }).populate("patient").populate("salle");
      res.json({ success: true, data: admission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAdmissionById(req, res) {
    try {
      const admission = await Admission.findById(req.params.id).populate("patient").populate("salle");
      if (!admission) {
        return res
          .status(404)
          .json({ success: false, message: "admission non trouvée" });
      }
      res.json({ success: true, data: admission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

 async createAdmission(req, res) {
    try {
      const { nomPatient, nomSalle, status, motif } = req.body;
      
      const patientTrouve = await Patient.findOne({ nom: nomPatient });
      if (!patientTrouve) {
        return res.status(404).json({
          success: false,
          message: `Le patient "${nomPatient}" n'existe pas.`
        });
      }

      const salleTrouvee = await Salle.findOne({ nom: nomSalle });
      if (!salleTrouvee) {
        return res.status(404).json({
          success: false,
          message: `La salle "${nomSalle}" n'existe pas.`
        });
      }

      if (salleTrouvee.lits_disponibles <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "Aucun lit n'est disponible dans cette salle",
        });
      }

      salleTrouvee.lits_disponibles -= 1;

      if (salleTrouvee.lits_disponibles === 0) {
        salleTrouvee.status = "Complète";
      }

      const admission = await Admission.create({
        patient: patientTrouve._id, 
        salle: salleTrouvee._id,
        status,
        motif,
      });

      await salleTrouvee.save();

      res.status(201).json({ success: true, data: admission });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateAdmission(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const admission = await Admission.findById(id);
      if (!admission) {
        return res.status(404).json({ success: false, message: "Admission non trouvée." });
      }

      if (status === "Sorti" && admission.status !== "Sorti") {
        const salleTrouvee = await Salle.findById(admission.salle);
        
        if (salleTrouvee) {
          salleTrouvee.lits_disponibles += 1;
          
          if (salleTrouvee.status === "Complète") {
            salleTrouvee.status = "Disponible";
          }
          
          await salleTrouvee.save();
        }

        admission.date_sortie = Date.now();
      }

      admission.status = status;
      await admission.save();

      res.status(200).json({ success: true, data: admission });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }



 /*  async updateAdmission(req, res) {
    try {
      const admission = await Admission.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );
      if (!admission) {
        return res
          .status(404)
          .json({ success: false, message: "admission non trouvée" });
      }
      res.json({ success: true, data: admission });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } */

  async deleteAdmission(req, res) {
    try {
      const admission = await Admission.findByIdAndDelete(req.params.id);
      if (!admission) {
        return res
          .status(404)
          .json({ success: false, message: "admission non trouvée" });
      }
      res
        .status(200)
        .json({ success: true, message: "admission supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  async sortiePatient(req, res) {
    try {
      const admission = await Admission.findByIdAndUpdate(
        req.params.id,
        { date_sortie: Date.now() },
        {
          returnDocument: "after",
          runValidators: true,
        },
      );
      if (!admission) {
        return res
          .status(404)
          .json({ success: false, message: "admission non trouvée" });
      }
      res.json({ success: true, data: admission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new AdmissionController();
