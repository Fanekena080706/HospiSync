import { useState, useEffect } from "react";
import AddMouvementModal from "./AddMouvementModal";
import "./Mouvement.css";
import Layout from "../../components/layout/Layout";
import { mouvementService } from "../../services/mouvement.Service";
import { Search, Plus, ArrowUpCircle, ArrowDownCircle, Package } from "lucide-react";

function Mouvements() {
  const [mouvements, setMouvements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMouvements();
  }, []);

  // Statistiques
  const stats = {
    total: mouvements.length,
    entrees: mouvements.filter(m => m.type === "Entrée").length,
    sorties: mouvements.filter(m => m.type === "Sortie").length,
  };

  const filteredMouvements = mouvements.filter((mouvement) => {
    const searchMatch = 
      mouvement.medicament?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      mouvement.observation?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return searchMatch;
    return searchMatch && mouvement.type === filter;
  });

  const loadMouvements = async () => {
    setIsLoading(true);
    try {
      const response = await mouvementService.getAll();
      setMouvements(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour formater la date
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "—", time: "—" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Fonction pour obtenir la classe du type
  const getTypeClass = (type) => {
    return type === "Entrée" ? "entree" : "sortie";
  };

  // Fonction pour obtenir l'icône du type
  const getTypeIcon = (type) => {
    return type === "Entrée" ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />;
  };

  return (
    <Layout>
      <div className="mouvement-page">
        {/* En-tête avec statistiques */}
        <div className="mouvement-header">
          <div className="mouvement-header-left">
            <h1>Mouvements de stock</h1>
            <span className="mouvement-count">{stats.total} mouvements</span>
          </div>
          
          <div className="mouvement-header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher un médicament..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              className="add-mouvement-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              Nouveau mouvement
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
            className={`filter-chip ${filter === "Entrée" ? "active" : ""}`}
            onClick={() => setFilter("Entrée")}
          >
             Entrées ({stats.entrees})
          </button>
          <button
            className={`filter-chip ${filter === "Sortie" ? "active" : ""}`}
            onClick={() => setFilter("Sortie")}
          >
             Sorties ({stats.sorties})
          </button>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Quantité</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Type</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ color: "#6b7280" }}>Chargement des mouvements...</div>
                  </td>
                </tr>
              ) : filteredMouvements.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem" }}>
                    <div className="empty-state">
                      {/* <div className="empty-icon"></div> */}
                      <h3>Aucun mouvement trouvé</h3>
                      <p>
                        {search
                          ? "Aucun résultat ne correspond à votre recherche"
                          : "Commencez par créer un nouveau mouvement de stock"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMouvements.map((mouvement, index) => {
                  const typeClass = getTypeClass(mouvement.type);
                  const dateTime = formatDateTime(mouvement.date);
                  const med = mouvement.medicament || {};

                  return (
                    <tr key={mouvement._id ?? index}>
                      <td>
                        <div className="med-info">
                          <div className={`med-icon ${typeClass}`}>
                            <Package size={18} />
                          </div>
                          <div>
                            <div className="med-name">{med.nom || "Médicament supprimé"}</div>
                            {med.categorie && (
                              <div style={{ 
                                fontSize: "0.7rem", 
                                color: "#9ca3af",
                                fontWeight: "500"
                              }}>
                                {med.categorie}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`quantity-display ${typeClass}`}>
                          {mouvement.type === "Entrée" ? "+" : "-"}{mouvement.quantite}
                        </span>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div className="date">{dateTime.date}</div>
                        </div>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div className="time">{dateTime.time}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${typeClass}`}>
                          <span className="type-dot" />
                          {getTypeIcon(mouvement.type)}
                          {mouvement.type}
                        </span>
                      </td>
                      <td>
                        <div className={`observation-text ${mouvement.observation ? "has-value" : ""}`}>
                          {mouvement.observation || "—"}
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
            Affichage de <strong>{filteredMouvements.length}</strong> sur <strong>{mouvements.length}</strong> mouvements
          </span>
          <span>
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddMouvementModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadMouvements}
          />
        )}
      </div>
    </Layout>
  );
}

export default Mouvements;