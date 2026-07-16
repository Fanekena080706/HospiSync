//VERSION MOck
const mockRooms = [
  { id: "A12", nom: "Urgence", service: "Urgences", capacite: 10, placesLibres: 2, occupation : 80 },
  { id: "B05", nom: "Salle 1", service: "Médecine", capacite: 8, placesLibres: 3, occupation : 62.5 },
  { id : "C30" , nom : "Salle 2", service : "Chirurgie", capacite : 12, placesLibres: 10, occupation : 16.7 },
];

export async function getRooms() {
  // simule 
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockRooms;
}