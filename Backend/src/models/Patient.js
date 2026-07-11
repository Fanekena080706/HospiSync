import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
{
    nom: {
        type: String,
        required: [true, "le nom est requis"],
        trim: true
    },

    prenom: {
        type: String,
        required: [true, "le prenom est requis"],
        trim: true
    },

    age: {
        type: Number,
        required: [true, "l'âge est requis"],
        min: [0, "l'âge ne peut pas être négatif"]
    },

    sexe: {
        type: String,
        enum: ["Masculin", "Féminin"],
        required: [true, "le sexe est requis"]
    },

    date_naissance: {
        type: Date,
        default: null
    },

    adresse: {
        type: String,
        default: ""
    },

    telephone: {
        type: String,
        default: ""
    },

    groupe_sanguin: {
        type: String,
        default: ""
    },

    niveau_urgence: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "le niveau d'urgence est requis"]
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