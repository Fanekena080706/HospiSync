import { useState, useEffect } from "react";
import Layout from '../../components/layout/Layout';
import './medication.css';
import { Search, Pencil, Trash2, Plus, Pill } from "lucide-react";
import { medicamentService } from '../../services/medicament.Service';
import AddMed from "./AjouterMed";

function Medicament() {
  const [medicaments, setMedicaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMedicaments();
  }, []);

  // Statistiques
  const stats = {
    total: medicaments.length,
    disponibles: medicaments.filter(m => m.quantite > m.seuil_alerte).length,
    faible: medicaments.filter(m => m.quantite <= m.seuil_alerte && m.quantite > 0).length,
    rupture: medicaments.filter(m => m.quantite <= 0).length,
  };

  const filteredMedicaments = medicaments.filter((med) => {
    const searchMatch = 
      med.nom?.toLowerCase().includes(search.toLowerCase()) ||
      med.categorie?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return searchMatch;
    
    if (filter === "disponible") {
      return searchMatch && med.quantite > med.seuil_alerte;
    }
    if (filter === "faible") {
      return searchMatch && med.quantite <= med.seuil_alerte && med.quantite > 0;
    }
    if (filter === "rupture") {
      return searchMatch && med.quantite <= 0;
    }
    return searchMatch;
  });

  const suppressionMedicament = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce médicament ? Cette action est irréversible.")) {
      return;
    }
    try {
      await medicamentService.delete(id);
      loadMedicaments();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const modifierMedicament = (med) => {
    setSelectedMedicament(med);
    setIsModalOpen(true);
  };

  const loadMedicaments = async () => {
    setIsLoading(true);
    try {
      const response = await medicamentService.getAll();
      setMedicaments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour obtenir la classe de statut
  const getStatusClass = (quantite, seuil) => {
    if (quantite <= 0) return "rupture";
    if (quantite <= seuil) return "faible";
    return "disponible";
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (quantite, seuil) => {
    if (quantite <= 0) return "Rupture";
    if (quantite <= seuil) return "Faible";
    return "Disponible";
  };

  // Fonction pour obtenir le pourcentage de stock
  const getStockPercentage = (quantite, seuil) => {
    if (quantite <= 0) return 0;
    const max = quantite + seuil * 2;
    return Math.min(Math.round((quantite / max) * 100), 100);
  };

  // Fonction pour obtenir la classe de quantité
  const getQuantityClass = (percentage) => {
    if (percentage > 60) return "high";
    if (percentage > 30) return "medium";
    return "low";
  };

  // Fonction pour obtenir la classe de catégorie
  const getCategoryClass = (categorie) => {
    const catMap = {
      "Comprimé": "comprime",
      "Gellule": "gellule",
      "Pommade": "pommade",
      "Sirop": "sirop",
      "Antibiotique": "antibiotique",
      "Analgésique": "analgésique",
      "Antitussif": "antitussif",
      "Anti-inflammatoire": "anti-inflammatoire"
    };
    return catMap[categorie] || "";
  };

  return (
    <Layout>
      <div className="medication-page">
        {/* En-tête avec statistiques */}
        <div className="medication-header">
          <div className="medication-header-left">
            <h1>Gestion des Médicaments</h1>
            <span className="med-count">{stats.total} médicaments</span>
          </div>
          
          <div className="medication-header-actions">
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
              className="add-med-btn"
              onClick={() => {
                setSelectedMedicament(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              Ajouter un médicament
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
            className={`filter-chip ${filter === "disponible" ? "active" : ""}`}
            onClick={() => setFilter("disponible")}
          >
             Disponibles ({stats.disponibles})
          </button>
          <button
            className={`filter-chip ${filter === "faible" ? "active" : ""}`}
            onClick={() => setFilter("faible")}
          >
             Faible ({stats.faible})
          </button>
          <button
            className={`filter-chip ${filter === "rupture" ? "active" : ""}`}
            onClick={() => setFilter("rupture")}
          >
             Rupture ({stats.rupture})
          </button>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Seuil d'alerte</th>
                <th>Unité</th>
                <th>État du stock</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ color: "#6b7280" }}>Chargement des médicaments...</div>
                  </td>
                </tr>
              ) : filteredMedicaments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "3rem" }}>
                    <div className="empty-state">
                      {/* <div className="empty-icon"></div> */}
                      <h3>Aucun médicament trouvé</h3>
                      <p>
                        {search
                          ? "Aucun résultat ne correspond à votre recherche"
                          : "Commencez par ajouter un nouveau médicament"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMedicaments.map((med) => {
                  const statusClass = getStatusClass(med.quantite, med.seuil_alerte);
                  const statusLabel = getStatusLabel(med.quantite, med.seuil_alerte);
                  const stockPercentage = getStockPercentage(med.quantite, med.seuil_alerte);
                  const quantityClass = getQuantityClass(stockPercentage);
                  const categoryClass = getCategoryClass(med.categorie);

                  return (
                    <tr key={med._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "0.75rem",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            flexShrink: 0
                          }}>
                            <Pill size={18} />
                          </div>
                          <span style={{ fontWeight: 600 }}>{med.nom}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge ${categoryClass}`}>
                          {med.categorie}
                        </span>
                      </td>
                      <td>
                        <div className="quantity-indicator">
                          <div className="quantity-bar">
                            <div
                              className={`quantity-fill ${quantityClass}`}
                              style={{ width: `${stockPercentage}%` }}
                            />
                          </div>
                          <span className="quantity-text">{med.quantite}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: "600",
                          color: med.quantite <= med.seuil_alerte ? "#ef4444" : "#6b7280"
                        }}>
                          {med.seuil_alerte}
                        </span>
                      </td>
                      <td>{med.unite || "—"}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          <span className="status-dot" />
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn-icon edit"
                            onClick={() => modifierMedicament(med)}
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="action-btn-icon delete"
                            onClick={() => suppressionMedicament(med._id)}
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
            Affichage de <strong>{filteredMedicaments.length}</strong> sur <strong>{medicaments.length}</strong> médicaments
          </span>
          <span>
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddMed
            med={selectedMedicament}
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadMedicaments}
          />
        )}
      </div>
    </Layout>
  );
}

export default Medicament;