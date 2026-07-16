import { Search, Trash2, Pencil, Eye, User, Calendar, Phone, MapPin, Droplet, Activity, Plus } from "lucide-react";
import Layout from "../../components/layout/Layout";
import "./Patients.css";
import AddPatients from "./AddPatients";
import PatientDetailModal from "./PatientDetailModal";
import { useEffect, useState } from "react";
import { patientService } from "../../services/patient.Service";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  // Statistiques
  const stats = {
    total: patients.length,
    niveau1: patients.filter(p => p.niveau_urgence === 1).length,
    niveau2: patients.filter(p => p.niveau_urgence === 2).length,
    niveau3: patients.filter(p => p.niveau_urgence === 3).length,
  };

  const filteredPatients = patients.filter((patient) => {
    const searchMatch = 
      patient.nom?.toLowerCase().includes(search.toLowerCase()) ||
      patient.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      patient.telephone?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return searchMatch;
    return searchMatch && patient.niveau_urgence === parseInt(filter);
  });

  const suppressionPatient = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.")) {
      return;
    }
    try {
      await patientService.delete(id);
      loadPatients();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const modifierPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const voirPatient = (patient) => {
    setViewingPatient(patient);
    setIsDetailModalOpen(true);
  };

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const response = await patientService.getAll();
      setPatients(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getSexeClass = (sexe) => {
    if (sexe === "Masculin") return "masculin";
    if (sexe === "Féminin") return "feminin";
    return "";
  };

  return (
    <Layout>
      <div className="patients-page">
        {/* En-tête avec statistiques */}
        <div className="patients-header">
          <div className="patients-header-left">
            <h1>Gestion des Patients</h1>
            <span className="patient-count">{stats.total} patients</span>
          </div>
          
          <div className="patients-header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              className="add-patient-btn"
              onClick={() => {
                setSelectedPatient(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              Ajouter un patient
            </button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="quick-filters">
          <button
            className={`filter-chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tous ({stats.total})
          </button>
          <button
            className={`filter-chip ${filter === "1" ? "active" : ""}`}
            onClick={() => setFilter("1")}
          >
             Urgence 1 ({stats.niveau1})
          </button>
          <button
            className={`filter-chip ${filter === "2" ? "active" : ""}`}
            onClick={() => setFilter("2")}
          >
             Urgence 2 ({stats.niveau2})
          </button>
          <button
            className={`filter-chip ${filter === "3" ? "active" : ""}`}
            onClick={() => setFilter("3")}
          >
             Urgence 3 ({stats.niveau3})
          </button>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Âge</th>
                <th>Sexe</th>
                <th>Groupe sanguin</th>
                <th>Niveau d'urgence</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ color: "#6b7280" }}>Chargement des patients...</div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem" }}>
                    <div className="empty-state">
                      {/* <div className="empty-icon"></div> */}
                      <h3>Aucun patient trouvé</h3>
                      <p>
                        {search
                          ? "Aucun résultat ne correspond à votre recherche"
                          : "Commencez par ajouter un nouveau patient"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const urgenceClass = getUrgenceClass(patient.niveau_urgence);
                  const sexeClass = getSexeClass(patient.sexe);
                  const sexeIcon = getSexeIcon(patient.sexe);

                  return (
                    <tr key={patient._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            flexShrink: 0
                          }}>
                            {patient.prenom?.[0]}{patient.nom?.[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {patient.prenom} {patient.nom}
                            </div>
                            {patient.telephone && (
                              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                                📞 {patient.telephone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{patient.age} ans</td>
                      <td>
                        <span className={`sexe-badge ${sexeClass}`}>
                          {sexeIcon} {patient.sexe}
                        </span>
                      </td>
                      <td>{patient.groupe_sanguin || "—"}</td>
                      <td>
                        <span className={`urgence-badge ${urgenceClass}`}>
                          <span className="urgence-dot" />
                          Niveau {patient.niveau_urgence}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn-icon view"
                            onClick={() => voirPatient(patient)}
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn-icon edit"
                            onClick={() => modifierPatient(patient)}
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="action-btn-icon delete"
                            onClick={() => suppressionPatient(patient._id)}
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
            Affichage de <strong>{filteredPatients.length}</strong> sur <strong>{patients.length}</strong> patients
          </span>
          <span>
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <AddPatients
            patient={selectedPatient}
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadPatients}
          />
        )}

        {isDetailModalOpen && viewingPatient && (
          <PatientDetailModal
            patient={viewingPatient}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}