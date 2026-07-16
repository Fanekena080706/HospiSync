// Rooms.jsx - Version améliorée
import { useState, useEffect } from "react";
import AddRoomModal from "./AddRoomModal";
import "./Rooms.css";
import Layout from "../../components/layout/Layout";
import { salleService } from "../../services/salle.Service";
import { Search, Plus, Pencil, Trash2, Bed, AlertCircle } from "lucide-react";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRooms();
  }, []);

  // Statistiques
  const stats = {
    total: rooms.length,
    disponibles: rooms.filter(r => r.status === "Disponible").length,
    occupees: rooms.filter(r => r.status === "Complète").length,
    maintenance: rooms.filter(r => r.status === "Maintenance").length,
  };

  const filteredRooms = rooms.filter((room) => {
    // Filtre de recherche
    const searchMatch = room.numero.toLowerCase().includes(search.toLowerCase()) ||
                       room.nom.toLowerCase().includes(search.toLowerCase()) ||
                       room.service?.toLowerCase().includes(search.toLowerCase());
    
    // Filtre de statut
    if (filter === "all") return searchMatch;
    return searchMatch && room.status === filter;
  });

  const suppressionSalle = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.")) {
      return;
    }
    try {
      await salleService.delete(id);
      loadRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const modifierSalle = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const response = await salleService.getAll();
      setRooms(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour obtenir la classe de statut
  const getStatusClass = (status) => {
    const statusMap = {
      "Disponible": "disponible",
      "Complète": "complète",
      "Maintenance": "maintenance",
      "Occupée": "occupée"
    };
    return statusMap[status] || "disponible";
  };

  // Fonction pour obtenir le pourcentage d'occupation
  const getOccupationPercentage = (capacite, litsDisponibles) => {
    if (!capacite || capacite === 0) return 0;
    return Math.round(((capacite - litsDisponibles) / capacite) * 100);
  };

  // Fonction pour obtenir la classe de la barre d'occupation
  const getCapacityClass = (percentage) => {
    if (percentage < 40) return "low";
    if (percentage < 70) return "medium";
    return "high";
  };

  return (
    <Layout>
      <div className="rooms-page">
        {/* En-tête avec statistiques */}
        <div className="rooms-header">
          <div className="rooms-header-left">
            <h1>Gestion des Salles</h1>
            <span className="room-count">{stats.total} salles</span>
          </div>
          
          <div className="rooms-header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              className="add-room-btn"
              onClick={() => {
                setSelectedRoom(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={18} />
              Ajouter une salle
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
            className={`filter-chip ${filter === "Disponible" ? "active" : ""}`}
            onClick={() => setFilter("Disponible")}
          >
            Disponibles ({stats.disponibles})
          </button>
          <button
            className={`filter-chip ${filter === "Complète" ? "active" : ""}`}
            onClick={() => setFilter("Complète")}
          >
            Complètes ({stats.occupees})
          </button>
          <button
            className={`filter-chip ${filter === "Maintenance" ? "active" : ""}`}
            onClick={() => setFilter("Maintenance")}
          >
            Maintenance ({stats.maintenance})
          </button>
        </div>

        {/* Tableau */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom</th>
                <th>Service</th>
                <th>Capacité</th>
                <th>Disponibles</th>
                <th>Occupation</th>
                <th>Statut</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ color: "#6b7280" }}>Chargement des salles...</div>
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "3rem" }}>
                    <div className="empty-state">
                      {/* <div className="empty-icon"></div> */}
                      <h3>Aucune salle trouvée</h3>
                      <p>
                        {search
                          ? "Aucun résultat ne correspond à votre recherche"
                          : "Commencez par ajouter une nouvelle salle"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  const occupancy = getOccupationPercentage(room.capacite, room.lits_disponibles);
                  const capacityClass = getCapacityClass(occupancy);
                  const statusClass = getStatusClass(room.status);

                  return (
                    <tr key={room._id}>
                      <td>
                        <strong style={{ color: "#667eea" }}>#{room.numero}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{room.nom}</span>
                      </td>
                      <td>{room.service || "—"}</td>
                      <td>{room.capacite}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: room.lits_disponibles > 0 ? "#10b981" : "#ef4444" }}>
                          {room.lits_disponibles}
                        </span>
                      </td>
                      <td>
                        <div className="capacity-indicator">
                          <div className="capacity-bar">
                            <div
                              className={`capacity-fill ${capacityClass}`}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                          <span className="capacity-text">{occupancy}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          <span className="status-dot" />
                          {room.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn-icon edit"
                            onClick={() => modifierSalle(room)}
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="action-btn-icon delete"
                            onClick={() => suppressionSalle(room._id)}
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

        {/* Pied de tableau avec information */}
        <div style={{ 
          marginTop: "1rem", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "#6b7280"
        }}>
          <span>
            Affichage de <strong>{filteredRooms.length}</strong> sur <strong>{rooms.length}</strong> salles
          </span>
          <span>
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddRoomModal
            room={selectedRoom}
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadRooms}
          />
        )}
      </div>
    </Layout>
  );
}

export default Rooms;