import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
{
    nom: {
        type: String,
        required: true,
        trim: true
    },

    prenom: {
        type: String,
        required: true,
        trim: true
    },

    sexe: {
        type: String,
        enum: ["Masculin", "Féminin"],
        required: true
    },

    date_naissance: {
        type: Date,
        required: true
    },

    adresse: {
        type: String,
        required: true
    },

    telephone: {
        type: String,
        required: true
    },

    groupe_sanguin: {
        type: String,
        required: true
    },

    niveau_urgence: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    informations_medicales: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
});

export default mongoose.model("Patient", patientSchema);