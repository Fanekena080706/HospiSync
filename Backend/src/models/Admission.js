import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
{
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    salle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salle",
        required: true
    },

    date_admission: {
        type: Date,
        default: Date.now
    },

    date_sortie: {
        type: Date
    },

    motif: {
        type: String,
    },

    status: {
        type: String,
        enum: ["Hospitalisé", "Sorti", "Transféré"],
        default: "Hospitalisé"
    }

},
{
    timestamps: true
});

export default mongoose.model("Admission", admissionSchema);