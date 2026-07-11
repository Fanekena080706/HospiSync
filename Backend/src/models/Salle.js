import mongoose from "mongoose";

const salleSchema = new mongoose.Schema(
{
    numero: {
        type: String,
        required:[true, "le numéro est requis"],
        unique: true
    },

    nom: {
        type: String,
        required: [true, "le nom est requis"],
    },

    service: {
        type: String
    },

    capacite: {
        type: Number,
        required: [true, "la capacité est requise"]
    },

    lits_disponibles: {
        type: Number,
        required: [true, "le nombre de lits disponibles est requis"]
    },

    status: {
        type: String,
        enum: ["Disponible", "Complète", "Maintenance"],
        default: "Disponible"
    }

},
{
    timestamps: true
});

export default mongoose.model("Salle", salleSchema);