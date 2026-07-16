import Medicament from '../models/Medicament.js';
import MouvementStock from '../models/MouvementStock.js'


// Tous les médicaments
export const getMedicaments = async (req, res) => {
    try{
        const medicaments = await Medicament.find();
        res.status(200).json(medicaments);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Un médicament
export const getMedicament = async (req, res) => {
    try{
        const medicament = await Medicament.findById(req.params.id);
        if(!medicament){
            return res.status(404).json({message: 'Médicament non trouvé'});
        }
        res.status(200).json(medicament)
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Ajouter
export const createMedicament = async (req, res) => {
    try{
        const medicament = await Medicament.create(req.body);
        res.status(201).json(medicament);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

// Modifier
export const updateMedicament = async (req, res) => {
    try{
        const medicament = await Medicament.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after' }
        );
        if(!medicament){
            return res.status(404).json({message: 'Médicament non trouvé'});
        }
        res.status(200).json(medicament);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

// Supprimer
export const deleteMedicament = async (req, res) => {
    try{
        const mouvement = await MouvementStock.findOne({medicament:req.params.id})
        if(mouvement){
            return res.status(409).json({message: 'Impossible de supprimer ce médicament. Des mouvements de stock existent.'})
        }
        const medicament = await Medicament.findByIdAndDelete(req.params.id);
        if(!medicament){
            return res.status(404).json({message: 'Médicament non trouvé'});
        }
        res.status(200).json({message: 'Médicament supprimé'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Alertes
export const getAlertesStock = async (req, res) => {
    try{
        const alertes = await Medicament.find({
            $expr: { $lte:["$quantite", "$seuil_alerte"]}
        });
        res.status(200).json(alertes);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};