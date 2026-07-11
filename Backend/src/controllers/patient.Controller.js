import Patient from "../models/Patient.js";

class PatientController {
  async getAllPatient(req, res) {
    try {
      const patients = await Patient.find().sort({ nom: 1 });
      res.json({ success: true, data: patients });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientById(req, res) {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "patient non trouvée" });
      }
      res.json({ success: true, data: patient });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createPatient(req, res) {
    try {
      const patient = new Patient(req.body);
      await patient.save();
      res.status(201).json({ success: true, data: patient });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updatePatient(req, res) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );
      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "patient non trouvée" });
      }
      res.json({ success: true, data: patient });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
  
  async deletePatient(req, res) {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "patient non trouvée" });
      }
      res.status(200).json({ success: true, message: "patient supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new PatientController();
