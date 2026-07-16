// AddRoomModal.jsx
import { useState } from "react";
import "./AddRoomModal.css";
import { IdCard } from "lucide-react";
import { salleService } from "../../services/salle.Service";

function AddRoomModal({room, onClose, onSuccess }) {
  const [numero, setNumero] = useState(room?.numero || "");
  const [nom, setNom] = useState(room?.nom || "");
  const [service, setService] = useState(room?.service || "");
  const [capacite, setCapacite] = useState(room?.capacite || 0);
  const [placesLibres, setPlacesLibres] = useState(room?.lits_disponibles || 0);
  const [error , setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    let status = room?.status || "Disponible";
    if (Number(placesLibres)> Number(capacite)) {
      setError("Le nombre de places libres ne peut pas dépasser la capacité de la salle.");
      return;
    }else if (Number(placesLibres) < 0) {
      setError("Le nombre de places libres ne peut pas être négatif.");
      return;
    }else if (Number(capacite) < 0) {
      setError("La capacité de la salle ne peut pas être négative.");
      return;
    }else if (Number(placesLibres) ===0) {
      status = "Complète";
    }else if (Number(placesLibres) === Number(capacite) || Number(placesLibres) > 0) {
      status = "Disponible";
    }
    const roomData = {
      numero: numero,
      nom:  nom,
      service: service,
      capacite: Number(capacite),
      lits_disponibles: Number(placesLibres),
      status: status
    };
    if(room){
      try{
        
        const response = await salleService.update(room._id, roomData);
        onSuccess(response.data.data);
        onClose();
      }catch(err){
        setError(err.response?.data?.message || "Une erreur est survenue lors de la modification de la salle.");
      }
    }else{
      try{
        const response = await salleService.create(roomData);
        onSuccess(response.data.data);
        onClose();
      }catch(err){
        setError(err.response?.data?.message || "Une erreur est survenue lors de l'ajout de la salle.");
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{room ? "Modifier une salle" : "Ajouter une salle"}</h2>

        {error && <p style = {{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>

          <label>Numéro</label>
          <input
            placeholder={room?.numero || "Numéro de la salle"}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
          <label>Nom</label>
          <input
            placeholder={room?.nom || "Nom de la salle"}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label>Service</label>
          <input
            placeholder={room?.service || "Service de la salle"}
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          />

          <label>Capacité</label>
          <input
            placeholder={room?.capacite || "Capacité de la salle"}
            type="number"
            value={capacite}
            onChange={(e) => setCapacite(e.target.value)}
            required
          />

          <label>Places libres</label>
          <input
            placeholder={room?.lits_disponibles || "Places libres"}
            type="number"
            value={placesLibres}
            onChange={(e) => setPlacesLibres(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">{room ? "Modifier" : "Ajouter"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal;