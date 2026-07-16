// PatientDetailModal.jsx
import { X, User, Calendar, Phone, MapPin, Droplet, Activity, Heart, AlertCircle } from "lucide-react";
import "./PatientDetailModal.css";

export default function PatientDetailModal({ patient, onClose }) {
  // Fonction pour obtenir la classe du niveau d'urgence
  const getUrgenceClass = (niveau) => {
    return `niveau-${niveau}`;
  };

  // Fonction pour obtenir l'icône du sexe
  const getSexeIcon = (sexe) => {
    if (sexe === "Masculin") return "♂";
    if (sexe === "Féminin") return "♀";
    return "";
  };

  // Fonction pour obtenir le libellé du niveau d'urgence
  const getUrgenceLabel = (niveau) => {
    const labels = {
      1: "Critique - Intervention immédiate",
      2: "Urgent - À traiter rapidement",
      3: "Modéré - Surveillance requise",
      4: "Mineur - Peut attendre",
      5: "Non urgent - Routine"
    };
    return labels[niveau] || `Niveau ${niveau}`;
  };

  // Fonction pour obtenir la couleur du niveau d'urgence
  const getUrgenceColor = (niveau) => {
    const colors = {
      1: "#ef4444",
      2: "#f59e0b",
      3: "#fbbf24",
      4: "#10b981",
      5: "#3b82f6"
    };
    return colors[niveau] || "#6b7280";
  };

  return (
    <div className="modal-overlay patient-detail-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="modal-header">
          <h2>
            <span className="modal-icon">
              <User size={18} />
            </span>
            Détails du patient
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Info principale */}
        <div className="patient-detail-header">
          <div className="patient-avatar-large">
            {patient.prenom?.[0]}{patient.nom?.[0]}
          </div>
          <div className="patient-detail-info">
            <h3>
              {patient.prenom} {patient.nom}
              <span style={{
                marginLeft: "0.5rem",
                fontSize: "0.8rem",
                fontWeight: "400",
                color: getUrgenceColor(patient.niveau_urgence)
              }}>
                {getSexeIcon(patient.sexe)}
              </span>
            </h3>
            <div className="sub-info">
              <span style={{ marginRight: "1rem" }}>
                <Calendar size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                {patient.age} ans
              </span>
              {patient.telephone && (
                <span style={{ marginRight: "1rem" }}>
                  <Phone size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                  {patient.telephone}
                </span>
              )}
              <span>
                <Activity size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                <span className={`urgence-badge ${getUrgenceClass(patient.niveau_urgence)}`} style={{ marginLeft: "0.3rem" }}>
                  <span className="urgence-dot" />
                  Niveau {patient.niveau_urgence}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Nom complet</div>
            <div className="value">{patient.prenom} {patient.nom}</div>
          </div>

          <div className="detail-item">
            <div className="label">Âge</div>
            <div className="value">{patient.age} ans</div>
          </div>

          <div className="detail-item">
            <div className="label">Sexe</div>
            <div className="value">
              <span className="sexe-badge" style={{ fontSize: "1rem" }}>
                {getSexeIcon(patient.sexe)} {patient.sexe}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="label">Groupe sanguin</div>
            <div className="value" style={{ fontWeight: "700", color: "#dc2626" }}>
              <Droplet size={16} style={{ display: "inline", verticalAlign: "middle" }} />
              {patient.groupe_sanguin || "Non renseigné"}
            </div>
          </div>

          {patient.telephone && (
            <div className="detail-item">
              <div className="label">Téléphone</div>
              <div className="value">
                <Phone size={16} style={{ display: "inline", verticalAlign: "middle" }} />
                {patient.telephone}
              </div>
            </div>
          )}

          {patient.adresse && (
            <div className="detail-item">
              <div className="label">Adresse</div>
              <div className="value">
                <MapPin size={16} style={{ display: "inline", verticalAlign: "middle" }} />
                {patient.adresse}
              </div>
            </div>
          )}

          <div className="detail-item">
            <div className="label">Niveau d'urgence</div>
            <div className="value">
              <AlertCircle size={16} style={{ display: "inline", verticalAlign: "middle", color: getUrgenceColor(patient.niveau_urgence) }} />
              <span style={{ 
                color: getUrgenceColor(patient.niveau_urgence),
                fontWeight: "700",
                marginLeft: "0.3rem"
              }}>
                {getUrgenceLabel(patient.niveau_urgence)}
              </span>
            </div>
          </div>

          {patient.date_naissance && (
            <div className="detail-item">
              <div className="label">Date de naissance</div>
              <div className="value">
                <Calendar size={16} style={{ display: "inline", verticalAlign: "middle" }} />
                {new Date(patient.date_naissance).toLocaleDateString('fr-FR')}
              </div>
            </div>
          )}

          {patient.informations_medicales && (
            <div className="detail-item full-width">
              <div className="label">Informations médicales</div>
              <div className="value" style={{ 
                background: "#f8f9fc",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                marginTop: "0.3rem",
                fontWeight: "400",
                lineHeight: "1.6"
              }}>
                <Heart size={16} style={{ display: "inline", verticalAlign: "middle", color: "#ef4444" }} />
                {patient.informations_medicales}
              </div>
            </div>
          )}

          {/* ID du patient */}
          <div className="detail-item full-width" style={{ background: "transparent", padding: "0.3rem 0" }}>
            <div className="label" style={{ fontSize: "0.6rem" }}>
              ID Patient
            </div>
            <div className="value" style={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: "400" }}>
              {patient._id}
            </div>
          </div>
        </div>

        {/* Actions du modal */}
        <div className="modal-actions">
          <button type="button" onClick={onClose} style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.7rem 2rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}