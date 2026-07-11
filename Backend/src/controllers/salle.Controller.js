import Salle from "../models/Salle.js";

class SalleController {
  // salle all
  async getAllSalles(req, res) {
    try {
      const salles = await Salle.find().sort({ nom: 1 });
      res.json({ success: true, data: salles });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // salle by id
  async getSalleById(req, res) {
    try {
      const salle = await Salle.findById(req.params.id);
      if (!salle) {
        return res.status(404).json({ success: false, message: "Salle non trouvée" });
      }
      res.json({ success: true, data: salle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  //creation salle
  async createSalle(req, res) {
    try {
      const existe = await Salle.findOne({ nom: req.body.nom });
      if (existe) {
        return res.status(400).json({
          success: false,
          message: "Une salle avec ce nom existe déjà",
        });
      }
      const salle = new Salle(req.body);
      await salle.save();
      res.status(201).json({ success: true, data: salle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  //modifier salle
  async updateSalle(req, res) {
    try {
      const salle = await Salle.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );
      if (!salle) {
        return res
          .status(404)
          .json({ success: false, message: "Salle non trouvée" });
      }
      res.json({ success: true, data: salle });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  //supprimer salle
  async deleteSalle(req, res) {
    try {
      const salle = await Salle.findByIdAndDelete(req.params.id);
      if (!salle) {
        return res
          .status(404)
          .json({ success: false, message: "Salle non trouvée" });
      }
      res.json({ success: true, message: "Salle supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new SalleController();
