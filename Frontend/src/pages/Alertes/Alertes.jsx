import { useState, useEffect } from "react";
import "./Alertes.css";
import Layout from "../../components/layout/Layout";
import { medicamentService } from "../../services/medicament.Service";
import { 
  AlertOctagon, 
  AlertTriangle, 
  Bell, 
  Package, 
  AlertCircle,
  CheckCircle 
} from "lucide-react";

function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlertes();
  }, []);

  const loadAlertes = async () => {
    setIsLoading(true);
    try {
      const response = await medicamentService.alertes();
      setAlertes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistiques
  const stats = {
    total: alertes.length,
    ruptures: alertes.filter(a => a.quantite <= 0).length,
    faibles: alertes.filter(a => a.quantite > 0 && a.quantite <= a.seuil_alerte).length,
  };

  // Fonction pour déterminer le niveau d'alerte
  const getAlertLevel = (med) => {
    if (med.quantite <= 0) return "critique";
    if (med.quantite <= med.seuil_alerte) return "warning";
    return "ok";
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (med) => {
    if (med.quantite <= 0) return "Rupture de stock";
    if (med.quantite <= med.seuil_alerte) return "Stock faible";
    return "Stock suffisant";
  };

  // Fonction pour obtenir le pourcentage de stock
  const getStockPercentage = (quantite, seuil) => {
    if (quantite <= 0) return 0;
    const max = seuil * 2;
    return Math.min(Math.round((quantite / max) * 100), 100);
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

  // Trier les alertes : les plus critiques en premier
  const sortedAlertes = [...alertes].sort((a, b) => {
    const order = { critique: 0, warning: 1, ok: 2 };
    const levelA = getAlertLevel(a);
    const levelB = getAlertLevel(b);
    return order[levelA] - order[levelB];
  });

  return (
    <Layout>
      <div className="alertes-page">
        {/* En-tête */}
        <div className="alertes-header">
          <div className="alertes-header-left">
            <h1>
              <Bell size={28} style={{ color: "#667eea" }} />
              Alertes de stock
            </h1>
            <span className={`alert-count ${stats.ruptures > 0 ? "critique" : "warning"}`}>
              {stats.total} alerte{stats.total > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="alert-stats">
          <div className="stat-card">
            <div className="stat-icon critique">
              <AlertOctagon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Ruptures de stock</span>
              <span className="stat-value critique">{stats.ruptures}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Stocks faibles</span>
              <span className="stat-value warning">{stats.faibles}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon info">
              <Package size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total des alertes</span>
              <span className="stat-value info">{stats.total}</span>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: "50px" }}></th>
                <th>Médicament</th>
                <th>Catégorie</th>
                <th>Stock actuel</th>
                <th>Seuil d'alerte</th>
                <th>Unité</th>
                <th>Statut</th>
                <th>Urgence</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ color: "#6b7280" }}>Chargement des alertes...</div>
                  </td>
                </tr>
              ) : sortedAlertes.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "3rem" }}>
                    <div className="empty-state">
                      <div className="empty-icon">✅</div>
                      <h3>Aucune alerte</h3>
                      <p>Tous les médicaments sont en stock suffisant</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAlertes.map((med) => {
                  const level = getAlertLevel(med);
                  const statusLabel = getStatusLabel(med);
                  const stockPercentage = getStockPercentage(med.quantite, med.seuil_alerte);
                  const categoryClass = getCategoryClass(med.categorie);
                  const isCritique = level === "critique";
                  const isWarning = level === "warning";

                  return (
                    <tr key={med._id} className={isCritique ? "alerte-critique" : isWarning ? "alerte-warning" : ""}>
                      <td>
                        <div className="alert-icon-wrapper">
                          {isCritique ? (
                            <AlertOctagon size={28} className="alert-icon critique" />
                          ) : isWarning ? (
                            <AlertTriangle size={28} className="alert-icon warning" />
                          ) : (
                            <CheckCircle size={28} style={{ color: "#10b981" }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                          {med.nom}
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge ${categoryClass}`}>
                          {med.categorie}
                        </span>
                      </td>
                      <td>
                        <div className="stock-indicator">
                          <div className="stock-bar">
                            <div
                              className={`stock-fill ${level === "critique" ? "critique" : level === "warning" ? "warning" : "ok"}`}
                              style={{ width: `${stockPercentage}%` }}
                            />
                          </div>
                          <span className={`stock-text ${level}`}>
                            {med.quantite}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: "600",
                          color: isCritique || isWarning ? "#ef4444" : "#6b7280"
                        }}>
                          {med.seuil_alerte}
                        </span>
                      </td>
                      <td>{med.unite || "—"}</td>
                      <td>
                        <span className={`status-badge ${isCritique ? "rupture" : isWarning ? "faible" : "disponible"}`}>
                          <span className="status-dot" />
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <span className={`urgence-level ${isCritique ? "critique" : isWarning ? "warning" : ""}`}>
                          {isCritique ? "🚨 CRITIQUE" : isWarning ? "⚠️ MODÉRÉ" : "✅ NORMAL"}
                        </span>
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
            {alertes.length > 0 ? (
              <>
                <span style={{ 
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  marginRight: "0.5rem"
                }} />
                <strong>{stats.ruptures}</strong> rupture{stats.ruptures > 1 ? "s" : ""} • 
                <span style={{ 
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#f59e0b",
                  marginLeft: "0.5rem",
                  marginRight: "0.5rem"
                }} />
                <strong>{stats.faibles}</strong> stock{stats.faibles > 1 ? "s" : ""} faible{stats.faibles > 1 ? "s" : ""}
              </>
            ) : "Aucune alerte en cours"}
          </span>
          <span>
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
        </div>
      </div>
    </Layout>
  );
}

export default Alertes;