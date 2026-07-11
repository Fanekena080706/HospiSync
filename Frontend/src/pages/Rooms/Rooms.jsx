// Rooms.jsx
import { useState, useEffect } from "react";
import { getRooms } from "../../services/roomService";
import AddRoomModal from "./AddRoomModal";
import "./Rooms.css";
import Layout from "../../components/layout/Layout";   

function Rooms() {  
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    getRooms().then((data) => {
      setRooms(data);
      setIsLoading(false);
    });
  }, []);

  function handleRoomAdded(newRoom) {
    setRooms([...rooms, newRoom]); // on garde les anciennes salles + on ajoute la nouvelle
  }

  if (isLoading) return <p>Chargement...</p>;

  return (
    <Layout>
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Salles</h1>
        <button className="add-room-btn" onClick={() => setIsModalOpen(true)}>
          + Ajouter une salle
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Nom</th>
            <th>Service</th>
            <th>Capacité</th>
            <th>Places libres</th>
            <th>Occupation</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            
            const occupancyClass = 
              room.occupation >= 80 ? 'occupation-haut' :
              room.occupation >= 50 ? 'occupation-medium' :
              'occupation-bas';
            
            return (
              <tr key={room.id ?? index}>
                <td>{room.id}</td>
                <td>{room.nom}</td>
                <td>{room.service}</td>
                <td>{room.capacite}</td>
                <td>{room.placesLibres}</td>
               
                <td>
                  <span className={`occupation ${occupancyClass}`}>
                    {room.occupation.toFixed(1)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && (
        <AddRoomModal
          onClose={() => setIsModalOpen(false)}
          onRoomAdded={handleRoomAdded}
        />
      )}
    </div>
    </Layout>
  );
}

export default Rooms;