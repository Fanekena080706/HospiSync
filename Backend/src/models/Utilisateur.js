import mongoose from "mongoose";

const utilisateurSchema = new mongoose.Schema(
{
    nom: {
        type: String,
        required: true
    },

    prenom: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    mot_de_passe: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["Administrateur", "Personnel"],
        default: "Personnel"
    }

},
{
    timestamps: true
});

export default mongoose.model("Utilisateur", utilisateurSchema);