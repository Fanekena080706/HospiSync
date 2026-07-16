import { useEffect, useState } from "react";
import "./AddMouvementModal.css";
import { X, Package, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import { mouvementService } from "../../services/mouvement.Service";
import { medicamentService } from "../../services/medicament.Service";

function AddMouvementModal({ onClose, onSuccess }) {
  const [medicamentId, setMedicamentId] = useState("");
  const [type, setType] = useState("Entrée");
  const [quantite, setQuantite] = useState("");
  const [date, setDate] = useState("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");
  const [listeMedicaments, setListeMedicaments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const response = await medicamentService.getAll();
        setListeMedicaments(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMedicaments();

    // Définir la date par défaut à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Mettre à jour le médicament sélectionné
  useEffect(() => {
    if (medicamentId) {
      const med = listeMedicaments.find(m => m._id === medicamentId);
      setSelectedMed(med);
    } else {
      setSelectedMed(null);
    }
  }, [medicamentId, listeMedicaments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validations
    if (!medicamentId) {
      setError("Veuillez sélectionner un médicament.");
      setIsLoading(false);
      return;
    }
    if (!quantite || Number(quantite) <= 0) {
      setError("La quantité doit être supérieure à zéro.");
      setIsLoading(false);
      return;
    }

    // Vérifier si la quantité est disponible pour une sortie
    if (type === "Sortie" && selectedMed) {
      if (Number(quantite) > selectedMed.quantite) {
        setError(`Stock insuffisant. Il ne reste que ${selectedMed.quantite} ${selectedMed.unite || "unités"} de ce médicament.`);
        setIsLoading(false);
        return;
      }
    }

    const newMouvement = {
      medicament: medicamentId,
      type: type,
      quantite: Number(quantite),
      observation: observation.trim() || undefined
    };

    if (date) {
      newMouvement.date = date;
    }

    try {
      const response = await mouvementService.create(newMouvement);
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de l'enregistrement du mouvement."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="modal-icon">
              <Package size={18} />
            </span>
            Nouveau mouvement de stock
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Médicament <span className="required">*</span>
            </label>
            <select
              value={medicamentId}
              onChange={(e) => setMedicamentId(e.target.value)}
              required
            >
              <option value="">Sélectionner un médicament</option>
              {listeMedicaments.map((med) => (
                <option key={med._id} value={med._id}>
                  {med.nom} - {med.quantite} {med.unite || "unités"} en stock
                </option>
              ))}
            </select>
            {selectedMed && (
              <div style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.2rem"
              }}>
                Stock actuel : <strong>{selectedMed.quantite}</strong> {selectedMed.unite || "unités"}
                {selectedMed.seuil_alerte && (
                  <span> • Seuil d'alerte : <strong>{selectedMed.seuil_alerte}</strong></span>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Type de mouvement <span className="required">*</span>
            </label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-option ${type === "Entrée" ? "active-entree" : ""}`}
                onClick={() => setType("Entrée")}
              >
                <ArrowUpCircle size={18} />
                Entrée
              </button>
              <button
                type="button"
                className={`type-option ${type === "Sortie" ? "active-sortie" : ""}`}
                onClick={() => setType("Sortie")}
              >
                <ArrowDownCircle size={18} />
                Sortie
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              Quantité <span className="required">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              placeholder="Quantité"
              required
            />
            {selectedMed && selectedMed.unite && (
              <div style={{
                fontSize: "0.7rem",
                color: "#9ca3af",
                marginTop: "0.2rem"
              }}>
                Unité : {selectedMed.unite}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Date du mouvement</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Observation</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Motif, commentaire, remarque..."
              rows="2"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Traitement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMouvementModal;