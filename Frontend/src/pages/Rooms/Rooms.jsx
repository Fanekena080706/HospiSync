import { useState, useEffect } from "react";
import { Trash2, Pencil, Search} from "lucide-react";
import AddRoomModal from "./AddRoomModal";
import "./Rooms.css";
import Layout from "../../components/layout/Layout";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(null);

  function handleOpenEdit(room) {
    setEdit(room);
    setIsModalOpen(true);
  }

  function handleRoomUpdated(updatedRoom) {
    const updatedRooms = rooms.map((room) =>
      room.id === updatedRoom.id ? updatedRoom : room
    );
    setRooms(updatedRooms);
  }

  function DeleteRoom(id) {
    const confirm = window.confirm("voulez-vous vraiment supprimer cette salle ?");
    if (!confirm) return;
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
  }

  // filtre les rooms selon la recherche
  const filteredRooms = rooms.filter(
    (room) =>
      room.nom?.toLowerCase().includes(search.toLowerCase()) ||
      room.service?.toLowerCase().includes(search.toLowerCase()) ||
      room.id?.toLowerCase().includes(search.toLowerCase())
  );

  // quand on clique sur le bouton ajouter
  function handleOpenAdd() {
    setEdit(null);
    setIsModalOpen(true);
  }

  function handleRoomAdded(newRoom) {
    setRooms([...rooms, newRoom]); // on garde les anciennes salles + on ajoute la nouvelle
  }

  if (isLoading) return <p>Chargement...</p>;

  return (
    <Layout>
      <div className="rooms-page">
        <div className="rooms-header">
          <h1>Salles</h1>
          <button className="add-room-btn" onClick={handleOpenAdd}>
            + Ajouter une salle
          </button>
        </div>

		<div className="Container-SearchPatient">
			<Search size={18} style={{margin:"10px"}} color="grey" />
			<input
			type="text"
			placeholder="Rechercher une salle..."
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			/>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room, index) => {
              const occupancyClass =
                room.occupation >= 80
                  ? "occupation-haut"
                  : room.occupation >= 50
                  ? "occupation-medium"
                  : "occupation-bas";

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
                  <td>
                    <div>
                      <button className="Button-Delete" onClick={() => DeleteRoom(room.id)}>
                        <Trash2 size={21} color="red" />
                      </button>
                      <button className="Button-Edit" onClick={() => handleOpenEdit(room)}>
                        <Pencil size={21} color="blue" />
                      </button>
                    </div>
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
            onRoomUpdated={handleRoomUpdated}
            roomToEdit={edit}
          />
        )}
      </div>
    </Layout>
  );
}

export default Rooms;