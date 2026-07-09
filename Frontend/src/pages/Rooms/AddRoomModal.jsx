// AddRoomModal.jsx
import { useState } from "react";
import "./AddRoomModal.css";
import { IdCard } from "lucide-react";

function AddRoomModal({ onClose, onRoomAdded }) {
  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [service, setService] = useState("");
  const [capacite, setCapacite] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // empêche le rechargement de page par défaut 

    const newRoom = {id, nom, service, capacite: Number(capacite) };
    onRoomAdded(newRoom); // on remonte la nouvelle salle au parent (Rooms.jsx)
    onClose(); // on ferme la modale
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Ajouter une salle</h2>

        <form onSubmit={handleSubmit}>

          <label>Numéro</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <label>Nom</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />

          <label>Service</label>
          <input value={service} onChange={(e) => setService(e.target.value)} required />

          <label>Capacité</label>
          <input
            type="number"
            value={capacite}
            onChange={(e) => setCapacite(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal;