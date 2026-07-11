// AddRoomModal.jsx
import { useState } from "react";
import "./AddRoomModal.css";
import { IdCard } from "lucide-react";

function AddRoomModal({ onClose, onRoomAdded }) {
  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [service, setService] = useState("");
  const [capacite, setCapacite] = useState("");
  const [placesLibres, setPlacesLibres] = useState("");
  const [error , setError] = useState("");


  function handleSubmit(e) {
    e.preventDefault();

    const capaciteNum = Number(capacite);
    const placesLibresNum = Number(placesLibres);

    // validation 
    if (capaciteNum <= 0 || placesLibresNum < 0 || placesLibresNum > capaciteNum) {
      setError("La capacité et les places libres doivent être des nombres positifs, et les places libres ne peuvent pas dépasser la capacité.");
      return;
    }

    //calcul an le pourcentage 
    const occupation = capaciteNum > 0 ? ((capaciteNum - placesLibresNum) / capaciteNum) * 100 : 0;

    const newRoom = {id, nom, service, capacite: Number(capacite), placesLibres: Number(placesLibres), occupation: Math.round(occupation * 10) / 10}; // arrondi à 1 décimale
    onRoomAdded(newRoom); // on remonte la nouvelle salle au parent (Rooms.jsx)
    onClose(); // on ferme la modale
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Ajouter une salle</h2>

        {error && <p style = {{ color: "red" }}>{error}</p>}

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

          <label>Places libres</label>
          <input
            type="number"
            value={placesLibres}
            onChange={(e) => setPlacesLibres(e.target.value)}
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