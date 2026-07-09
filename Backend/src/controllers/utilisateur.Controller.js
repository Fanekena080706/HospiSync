import Utilisateur from "../models/Utilisateur.js";
import bcrypt from "bcryptjs";

// Tous les utilisateurs
export const getUtilisateurs = async (req, res) => {
    try {

        const utilisateurs = await Utilisateur.find().select("-mot_de_passe");

        res.status(200).json(utilisateurs);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

// Un utilisateur
export const getUtilisateur = async (req, res) => {
    try {

        const utilisateur = await Utilisateur.findById(req.params.id)
            .select("-mot_de_passe");

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json(utilisateur);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};



// Modifier
export const updateUtilisateur = async (req, res) => {
    try {

        const utilisateur = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json(utilisateur);

    } catch (error) {

        res.status(400).json({ message: error.message });

    }
};

// Supprimer
export const deleteUtilisateur = async (req, res) => {
    try {

        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json({ message: "Utilisateur supprimé." });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

// Ajouter
export const createUtilisateur = async (req, res) => {
    try {

        const { nom, prenom, email, mot_de_passe, role } = req.body;
        const existe = await Utilisateur.findOne({ email});
        
        if(existe){
            return res.status(400).json({message: "Cet email est déjà utilisé."});
        }

        const motDePasseCrypte = await bcrypt.hash(mot_de_passe, 10);
        
        const utilisateur = await Utilisateur.create({
            nom,
            prenom,
            email,
            mot_de_passe: motDePasseCrypte,
            role
        });

        res.status(201).json({message: "Utilisateur créé avec succès.", utilisateur});

    } catch (error) {

        res.status(400).json({ message: error.message });

    }
};

// Connexion 
export const login = async (req, res) => {

    try{
        const { email, mot_de_passe } = req.body;
        const utilisateur = await Utilisateur.findOne({email});
        if(!utilisateur){
            return res.status(404).json({
                message: "Email ou mot de passe incorrect."
            })
        }

        const motDePasseValide = await bcrypt.compare(
            mot_de_passe,
            utilisateur.mot_de_passe
        )
        if(!motDePasseValide){
            return res.status(404).json({
                message: "Email ou mot de passe incorrect."
            })
        }

        res.status(200).json({
            message: "Connexion réussie.",
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });

    }catch(err){
        res.status(500).json({message: err.message});
    }

};