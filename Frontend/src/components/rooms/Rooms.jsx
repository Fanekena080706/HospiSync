// Rooms.jsx
import { useState, useEffect } from "react";
import { getRooms } from "../../services/roomsService";
import AddRoomModal from "./AddRoomModal";


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
    setRooms([...rooms, newRoom]); //garde les anciennes salles + on ajoute la nouvel
  }

  if (isLoading) return <p>Chargement...</p>;

  return (
        <div className="rooms-page">
            <div className="rooms-header">
                <h1>Salles</h1>
                <button onClick={() => setIsModalOpen(true)}>+ Ajouter une salle</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Nom</th>
                    <th>Service</th>
                    <th>Capacité</th>
                </tr>
                </thead>
                <tbody>
                {rooms.map((room, index) => (
                    <tr key={room.id ?? index}>
                    <td>{room.id}</td>
                    <td>{room.nom}</td>
                    <td>{room.service}</td>
                    <td>{room.capacite}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isModalOpen && (
                <AddRoomModal
                onClose={() => setIsModalOpen(false)}
                onRoomAdded={handleRoomAdded}
                />
            )}
        </div>

  );
}

export default Rooms;