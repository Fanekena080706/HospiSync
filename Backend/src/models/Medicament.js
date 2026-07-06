import mongoose from "mongoose";

const medicamentSchema = new mongoose.Schema(
    {
        nom : {
            type: String,
            required: true,
        },

        categorie:{
            type: String,
            required: true,

        },
        quantite:{
            type : Number,
            default: 0
        },
        seuil_alerte:{
            type: Number,
            required: true
        },
        unite:{
            type: String,
            required: true,
        }
    },
{
    timestamps: true
});

export default mongoose.model("Medicament", medicamentSchema);