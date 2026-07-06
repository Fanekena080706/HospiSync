import mongoose from "mongoose";

const mouvementStockSchema = new mongoose.Schema(
{
    medicament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicament",
        required: true
    },

    type: {
        type: String,
        enum: ["Entrée", "Sortie"],
        required: true
    },

    quantite: {
        type: Number,
        required: true
    },

    observation: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps: true
});

export default mongoose.model("MouvementStock", mouvementStockSchema);