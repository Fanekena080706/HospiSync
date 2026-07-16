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

  static getCurrentWeekRange() {
      const now = new Date();
  
      const day = now.getDay();
  
      // Lundi de la semaine courante
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
      startOfWeek.setHours(0, 0, 0, 0);
  
      // Dimanche de la semaine courante
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
  
      return { startOfWeek, endOfWeek };
    }
    async getAdmissionsCurrentWeek(req, res) {
      try {
        const { startOfWeek } = AdmissionController.getCurrentWeekRange();
  
        // 1. Générer les 7 jours de la semaine
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
  
          weekDates.push({
            date: date.toISOString().split("T")[0], // "2026-07-14"
            jour: date.toLocaleString("fr-FR", { weekday: "long" }), // "lundi"
            nombre_admissions: 0,
          });
        }
  
        const admissions = await Admission.aggregate([
          {
            $match: {
              date_admission: {
                $gte: startOfWeek,
                $lte: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date_admission" },
              },
              nombre_admissions: { $sum: 1 },
            },
          },
        ]);
  
        admissions.forEach((item) => {
          const found = weekDates.find((day) => day.date === item._id);
          if (found) {
            found.nombre_admissions = item.nombre_admissions;
          }
        });
  
        res.status(200).json({
          periode: "Semaine courante",
          debut_semaine: weekDates[0].date,
          fin_semaine: weekDates[6].date,
          total_admissions: weekDates.reduce(
            (sum, day) => sum + day.nombre_admissions,
            0,
          ),
          jours: weekDates,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
      }
    }
}

export default new AdmissionController();
