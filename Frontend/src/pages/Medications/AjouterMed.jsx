// AjouterMed.jsx - Version améliorée
import { useState } from "react";
import "./AjoutMed.css";
import { X, Pill, AlertCircle } from "lucide-react";
import { medicamentService } from "../../services/medicament.Service";

function AddMed({ med, onClose, onSuccess }) {
  const [nom, setNom] = useState(med?.nom || "");
  const [categorie, setCategorie] = useState(med?.categorie || "Comprimé");
  const [quantite, setQuantite] = useState(med?.quantite || 0);
  const [seuil, setSeuil] = useState(med?.seuil_alerte || 10);
  const [unite, setUnite] = useState(med?.unite || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Comprimé",
    "Gellule",
    "Pommade",
    "Sirop",
    "Antibiotique",
    "Analgésique",
    "Antitussif",
    "Anti-inflammatoire",
    "Vaccin",
    "Sérum",
    "Collyre",
    "Suppositoire"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (quantite < 0) {
      setError("La quantité ne peut pas être négative.");
      setIsLoading(false);
      return;
    }
    if (seuil < 0) {
      setError("Le seuil d'alerte ne peut pas être négatif.");
      setIsLoading(false);
      return;
    }
    if (!nom.trim()) {
      setError("Le nom du médicament est requis.");
      setIsLoading(false);
      return;
    }

    const newMedicament = {
      nom: nom.trim(),
      categorie: categorie,
      quantite: Number(quantite),
      seuil_alerte: Number(seuil),
      unite: unite.trim() || "unité"
    };

    try {
      let response;
      if (med) {
        response = await medicamentService.update(med._id, newMedicament);
      } else {
        response = await medicamentService.create(newMedicament);
      }
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de l'enregistrement."
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
              <Pill size={18} />
            </span>
            {med ? "Modifier le médicament" : "Ajouter un médicament"}
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
              Nom du médicament <span className="required">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Paracétamol"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Catégorie <span className="required">*</span>
            </label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Quantité <span className="required">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Unité <span className="required">*</span>
              </label>
              <input
                type="text"
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                placeholder="Ex: mg, ml, comprimé"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Seuil d'alerte <span className="required">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={seuil}
              onChange={(e) => setSeuil(e.target.value)}
              placeholder="10"
              required
            />
            <div style={{ 
              fontSize: "0.7rem", 
              color: "#6b7280",
              marginTop: "0.2rem"
            }}>
              ⚠️ Une alerte sera déclenchée lorsque la quantité atteindra ce seuil
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Traitement..." : (med ? "Modifier" : "Ajouter")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMed;