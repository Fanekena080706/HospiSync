import { useState } from "react";
import "./AddPatients.css";
import { X, User, AlertCircle } from "lucide-react";
import { patientService } from "../../services/patient.Service";

export default function AddPatients({ patient, onClose, onSuccess }) {
  const [nom, setNom] = useState(patient?.nom || "");
  const [prenom, setPrenom] = useState(patient?.prenom || "");
  const [age, setAge] = useState(patient?.age || 0);
  const [sexe, setSexe] = useState(patient?.sexe || "");
  const [groupeSanguin, setGroupeSanguin] = useState(patient?.groupe_sanguin || "");
  const [phone, setPhone] = useState(patient?.telephone || "");
  const [adresse, setAdresse] = useState(patient?.adresse || "");
  const [dateNaissance, setDateNaissance] = useState(
    patient?.date_naissance ? patient.date_naissance.split('T')[0] : ""
  );
  const [infos, setInfos] = useState(patient?.informations_medicales || "");
  const [niveau, setNiveau] = useState(patient?.niveau_urgence || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      sexe: sexe,
      age: parseInt(age),
      niveau_urgence: parseInt(niveau),
    };

    if (phone) data.telephone = phone.trim();
    if (adresse) data.adresse = adresse.trim();
    if (groupeSanguin) data.groupe_sanguin = groupeSanguin;
    if (infos) data.informations_medicales = infos.trim();
    if (dateNaissance) data.date_naissance = dateNaissance;

    try {
      let response;
      if (patient) {
        response = await patientService.update(patient._id, data);
      } else {
        response = await patientService.create(data);
      }
      onSuccess(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="modal-icon">
              <User size={18} />
            </span>
            {patient ? "Modifier le patient" : "Ajouter un patient"}
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
          <div className="form-row">
            <div className="form-group">
              <label>
                Nom <span className="required">*</span>
              </label>
              <input
                type="text"
                value={nom}
                placeholder="Nom"
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Prénom <span className="required">*</span>
              </label>
              <input
                type="text"
                value={prenom}
                placeholder="Prénom"
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Sexe <span className="required">*</span>
              </label>
              <select
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                required
              >
                <option value="">Sélectionner</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date de naissance</label>
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Âge <span className="required">*</span>
              </label>
              <input
                type="number"
                value={age}
                placeholder="Âge"
                onChange={(e) => setAge(e.target.value)}
                required
                min={0}
              />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                placeholder="034 12 345 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={13}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Groupe sanguin</label>
              <select
                value={groupeSanguin}
                onChange={(e) => setGroupeSanguin(e.target.value)}
              >
                <option value="">Sélectionner</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                Niveau d'urgence <span className="required">*</span>
              </label>
              <select
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                required
              >
                <option value="">Sélectionner</option>
                <option value="1">1 - Critique</option>
                <option value="2">2 - Urgent</option>
                <option value="3">3 - Modéré</option>
                <option value="4">4 - Mineur</option>
                <option value="5">5 - Non urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              value={adresse}
              placeholder="Adresse complète"
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Informations médicales</label>
            <textarea
              value={infos}
              placeholder="Antécédents, allergies, traitements en cours..."
              onChange={(e) => setInfos(e.target.value)}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit">
              {patient ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}