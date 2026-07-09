//VERSION MOck
const mockRooms = [
  { id: "A12", nom: "Urgence", service: "Urgences", capacite: 10, placesLibres: 2 },
  { id: "B05", nom: "Salle 1", service: "Médecine", capacite: 8, placesLibres: 3 },
];

export async function getRooms() {
  // simule 
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockRooms;
}