import { Search, Trash2, Pencil, Eye, User, Bed, Calendar, Clock, Plus, Activity } from "lucide-react";
import Layout from "../../components/layout/Layout";
import "./Admissions.css";
import { useEffect, useState } from "react";
import { admissionService } from "../../services/admission.Service";
import AddAdmissions from "./AddAdmissions";
import AdmissionDetailModal from "./AdmissionDetailModal";

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [viewingAdmission, setViewingAdmission] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdmissions();
  }, []);

  // Statistiques
  const stats = {
    total: admissions.length,
    hospitalises: admissions.filter(a => a.status === "Hospitalisé").length,
    sortis: admissions.filter(a => a.status === "Sorti").length,
    transferes: admissions.filter(a => a.status === "Transféré").length,
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const searchMatch = 
      admission.patient?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      admission.patient?.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      admission.salle?.numero?.toLowerCase().includes(search.toLowerCase()) ||
      admission.salle?.nom?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return searchMatch;
    return searchMatch && admission.status === filter;
  });

  const suppressionAdmission = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette admission ? Cette action est irréversible.")) {
      return;
    }
    try {
      await admissionService.delete(id);
      loadAdmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const modifierAdmission = (admission) => {
    setSelectedAdmission(admission);
    setIsModalOpen(true);
  };

  const voirAdmission = (admission) => {
    setViewingAdmission(admission);
    setIsDetailModalOpen(true);
  };

  const loadAdmissions = async () => {
    setIsLoading(true);
    try {
      const response = await admissionService.getAll();
      setAdmissions(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Layout>
      <div className="admissions-page">
        {/* En-tête avec statistiques */}
        <div className="admissions-header">
          <div className="admissions-header-left">
            <h1>Gestion des Admissions</h1>
            <span className="admission-count">{stats.total} admissions</span>
          </div>
          
          <div className="admissions-header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher un patient ou une salle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              className="add-admission-btn"
              onClick={() => {
                setSelectedAdmission(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              Nouvelle admission
            </button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="quick-filters">
          <button
            className={`filter-chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Toutes ({stats.total})
          </button>
          <button
            className={`filter-chip ${filter === "Hospitalisé" ? "active" : ""}`}
            onClick={() => setFilter("Hospitalisé")}
          >
             Hospitalisés ({stats.hospitalises})
          </button>
          <button
            className={`filter-chip ${filter === "Transféré" ? "active" : ""}`}
            onClick={() => setFilter("Transféré")}
          >
             Transférés ({stats.transferes})
          </button>
          <button
            className={`filter-chip ${filter === "Sorti" ? "active" : ""}`}
            onClick={() => setFilter("Sorti")}
          >
             Sortis ({stats.sortis})
          </button>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Salle</th>
                <th>Date admission</th>
                <th>Heure</th>
                <th>Date sortie</th>
                <th>Heure sortie</th>
                <th>Statut</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ color: "#6b7280" }}>Chargement des admissions...</div>
                  </td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "3rem" }}>
                    <div className="empty-state">
                      {/* <div className="empty-icon"></div> */}
                      <h3>Aucune admission trouvée</h3>
                      <p>
                        {search
                          ? "Aucun résultat ne correspond à votre recherche"
                          : "Commencez par créer une nouvelle admission"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((admission) => {
                  const statusClass = getStatusClass(admission.status);
                  const dateAdm = formatDate(admission.date_admission);
                  const dateSortie = formatDate(admission.date_sortie);
                  const patient = admission.patient || {};
                  const salle = admission.salle || {};

                  return (
                    <tr key={admission._id}>
                      <td>
                        <div className="patient-info">
                          <div className="patient-avatar">
                            {patient.prenom?.[0]}{patient.nom?.[0]}
                          </div>
                          <div>
                            <div className="patient-name">
                              {patient.prenom} {patient.nom}
                            </div>
                            {patient.telephone && (
                              <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                                📞 {patient.telephone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="room-info">
                          <Bed size={14} style={{ color: "#667eea" }} />
                          <span className="room-badge">
                            {salle.numero} - {salle.nom}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div>{dateAdm?.date}</div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div className="time">
                            <Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                            {dateAdm?.time}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div>{dateSortie?.date || "—"}</div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div className="time">
                            {dateSortie?.time ? (
                              <>
                                <Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                                {dateSortie.time}
                              </>
                            ) : "—"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          <span className="status-dot" />
                          {admission.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn-icon view"
                            onClick={() => voirAdmission(admission)}
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn-icon edit"
                            onClick={() => modifierAdmission(admission)}
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="action-btn-icon delete"
                            onClick={() => suppressionAdmission(admission._id)}
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau */}
        <div style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "#6b7280"
        }}>
          <span>
            Affichage de <strong>{filteredAdmissions.length}</strong> sur <strong>{admissions.length}</strong> admissions
          </span>
          <span>
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <AddAdmissions
            admission={selectedAdmission}
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadAdmissions}
          />
        )}

        {isDetailModalOpen && viewingAdmission && (
          <AdmissionDetailModal
            admission={viewingAdmission}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}