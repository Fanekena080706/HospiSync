import MouvementStock from "../models/MouvementStock.js";
import Medicament from "../models/Medicament.js";

// Tous les mouvements
export const getMouvements = async (req, res) => {
    try {
        const mouvements = await MouvementStock.find()
            .populate("medicament");

        res.status(200).json(mouvements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajouter un mouvement
export const createMouvement = async (req, res) => {
    try {

        const { medicament, type, quantite } = req.body;

        const mouvement = await MouvementStock.create(req.body);

        const med = await Medicament.findById(medicament);

        if (!med) {
            return res.status(404).json({ message: "Médicament introuvable." });
        }

        if (type === "Entrée") {
            med.quantite += quantite;
        } else {
            med.quantite -= quantite;
        }

        await med.save();

        res.status(201).json(mouvement);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};