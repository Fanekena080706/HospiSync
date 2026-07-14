// AddRoomModal.jsx
import { useState, useEffect } from "react";
import "./AddRoomModal.css";

function AddRoomModal({ onClose, onRoomAdded, onRoomUpdated, roomToEdit }) {
  const [id, setId] = useState("");
  const [nom, setNom] = useState("");
  const [service, setService] = useState("");
  const [capacite, setCapacite] = useState("");
  const [placesLibres, setPlacesLibres] = useState("");
  const [error, setError] = useState("");

  // Affichage du form quand edition d'une salle
  useEffect(() => {
    if (roomToEdit) {
      setId(roomToEdit.id);
      setNom(roomToEdit.nom);
      setService(roomToEdit.service);
      setCapacite(roomToEdit.capacite.toString());
      setPlacesLibres(roomToEdit.placesLibres.toString());
    }
  }, [roomToEdit]);

  function handleSubmit(e) {
    e.preventDefault();

    const capaciteNum = Number(capacite);
    const placesLibresNum = Number(placesLibres);

    // validation
    if (capaciteNum <= 0 || placesLibresNum < 0 || placesLibresNum > capaciteNum) {
      setError(
        "La capacité et les places libres doivent être des nombres positifs, et les places libres ne peuvent pas dépasser la capacité."
      );
      return;
    }

    setError("");

    // calcul du pourcentage d'occupation
    const occupation =
      capaciteNum > 0 ? ((capaciteNum - placesLibresNum) / capaciteNum) * 100 : 0;
    const occupationArrondie = Math.round(occupation * 10) / 10; // arrondi à 1 décimale

    if (roomToEdit) {
      const updatedRoom = {
        id: roomToEdit.id,
        nom,
        service,
        capacite: capaciteNum,
        placesLibres: placesLibresNum,
        occupation: occupationArrondie,
      };
      onRoomUpdated(updatedRoom);
      onClose();
      return;
    }

    const newRoom = {
      id,
      nom,
      service,
      capacite: capaciteNum,
      placesLibres: placesLibresNum,
      occupation: occupationArrondie,
    };
    onRoomAdded(newRoom); // on remonte la nouvelle salle au parent
    onClose(); // on ferme la modale
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{roomToEdit ? "Modifier une salle" : "Ajouter une salle"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Numéro</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            disabled={!!roomToEdit} // l'id ne doit pas changer en édition
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
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit">{roomToEdit ? "Modifier" : "Ajouter"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal;