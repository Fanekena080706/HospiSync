import mongoose from "mongoose";

const salleSchema = new mongoose.Schema(
{
    numero: {
        type: String,
        required: true,
        unique: true
    },

    nom: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true
    },

    capacite: {
        type: Number,
        required: true
    },

    lits_disponibles: {
        type: Number,
        required: true
    },

    statut: {
        type: String,
        enum: ["Disponible", "Complète", "Maintenance"],
        default: "Disponible"
    }

},
{
    timestamps: true
});

export default mongoose.model("Salle", salleSchema);