// AdmissionDetailModal.jsx
import { X, User, Bed, Calendar, Clock, Activity, ArrowRight, AlertCircle } from "lucide-react";
import "./AdmissionDetailModal.css";

export default function AdmissionDetailModal({ admission, onClose }) {
  const patient = admission.patient || {};
  const salle = admission.salle || {};

  // Fonction pour obtenir la classe du statut
  const getStatusClass = (status) => {
    const statusMap = {
      "Hospitalisé": "hospitalisé",
      "Sorti": "sorti",
      "Transféré": "transféré"
    };
    return statusMap[status] || "hospitalisé";
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      full: date.toLocaleString('fr-FR')
    };
  };

  // Calcul de la durée d'hospitalisation
  const calculateDuration = () => {
    if (!admission.date_admission) return null;
    const start = new Date(admission.date_admission);
    const end = admission.date_sortie ? new Date(admission.date_sortie) : new Date();
    const diff = end - start;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let parts = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    return parts.join(' ') || 'Quelques instants';
  };

  const dateAdm = formatDate(admission.date_admission);
  const dateSortie = formatDate(admission.date_sortie);
  const duration = calculateDuration();
  const statusClass = getStatusClass(admission.status);

  return (
    <div className="modal-overlay admission-detail-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="modal-header">
          <h2>
            <span className="modal-icon">
              <Activity size={18} />
            </span>
            Détails de l'admission
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Statut en haut */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "1.5rem",
          padding: "0.75rem 1rem",
          background: "#f8f9fc",
          borderRadius: "0.75rem"
        }}>
          <span style={{ fontWeight: "600", color: "#6b7280" }}>
            Statut actuel
          </span>
          <span className={`status-badge ${statusClass}`} style={{ fontSize: "0.9rem", padding: "0.4rem 1.2rem" }}>
            <span className="status-dot" />
            {admission.status}
          </span>
        </div>

        {/* Info patient */}
        <div className="detail-section">
          <h3 className="detail-section-title">
            <User size={16} /> Informations du patient
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="label">Nom complet</div>
              <div className="value" style={{ fontWeight: "600" }}>
                {patient.prenom} {patient.nom}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Âge</div>
              <div className="value">{patient.age || "—"} ans</div>
            </div>
            <div className="detail-item">
              <div className="label">Sexe</div>
              <div className="value">{patient.sexe || "—"}</div>
            </div>
            <div className="detail-item">
              <div className="label">Groupe sanguin</div>
              <div className="value" style={{ fontWeight: "700", color: "#dc2626" }}>
                {patient.groupe_sanguin || "Non renseigné"}
              </div>
            </div>
            {patient.telephone && (
              <div className="detail-item">
                <div className="label">Téléphone</div>
                <div className="value">{patient.telephone}</div>
              </div>
            )}
            {patient.adresse && (
              <div className="detail-item">
                <div className="label">Adresse</div>
                <div className="value">{patient.adresse}</div>
              </div>
            )}
            {patient.informations_medicales && (
              <div className="detail-item full-width">
                <div className="label">Informations médicales</div>
                <div className="value" style={{ 
                  background: "#f8f9fc",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  fontWeight: "400"
                }}>
                  {patient.informations_medicales}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info salle */}
        <div className="detail-section">
          <h3 className="detail-section-title">
            <Bed size={16} /> Informations de la salle
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="label">Salle</div>
              <div className="value" style={{ fontWeight: "600" }}>
                {salle.numero} - {salle.nom}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Service</div>
              <div className="value">{salle.service || "—"}</div>
            </div>
            <div className="detail-item">
              <div className="label">Capacité</div>
              <div className="value">{salle.capacite} places</div>
            </div>
            <div className="detail-item">
              <div className="label">Lits disponibles</div>
              <div className="value" style={{ 
                color: salle.lits_disponibles > 0 ? "#10b981" : "#ef4444",
                fontWeight: "700"
              }}>
                {salle.lits_disponibles || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="detail-section">
          <h3 className="detail-section-title">
            <Calendar size={16} /> Chronologie
          </h3>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon" style={{ background: "#3b82f6" }}>
                <Calendar size={14} />
              </div>
              <div className="timeline-content">
                <div className="timeline-label">Date d'admission</div>
                <div className="timeline-value">
                  {dateAdm?.date}
                  <span className="timeline-time">
                    <Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                    {dateAdm?.time}
                  </span>
                </div>
              </div>
            </div>

            {admission.date_sortie && (
              <div className="timeline-item">
                <div className="timeline-icon" style={{ background: "#10b981" }}>
                  <ArrowRight size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-label">Date de sortie</div>
                  <div className="timeline-value">
                    {dateSortie?.date}
                    <span className="timeline-time">
                      <Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                      {dateSortie?.time}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="timeline-item">
              <div className="timeline-icon" style={{ 
                background: admission.status === "Hospitalisé" ? "#f59e0b" : "#6b7280"
              }}>
                <Activity size={14} />
              </div>
              <div className="timeline-content">
                <div className="timeline-label">Durée d'hospitalisation</div>
                <div className="timeline-value" style={{ fontWeight: "700", color: "#667eea" }}>
                  {duration}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ID de l'admission */}
        <div style={{ 
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid #f3f4f6",
          fontSize: "0.65rem",
          color: "#9ca3af"
        }}>
          ID Admission : {admission._id}
        </div>

        {/* Actions */}
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