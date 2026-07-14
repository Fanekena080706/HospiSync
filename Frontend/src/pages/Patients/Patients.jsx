import { Search,Trash2,Pencil } from "lucide-react";
import Layout from "../../components/layout/Layout";
import "./Patients.css";
import AddPatients from "./AddPatients";
import { useState } from "react";


export default function Patients(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [edit,setEdit] = useState(null);
    function handlePatients(newPatient){
        setPatients([...patients, newPatient]);
    }

    // rehefa le bouton ajouter no kitihana
    function handleOpenAdd(){
        setEdit(null);
        setIsModalOpen(true);
    }
    function handleOpenEdit(patient){
        setEdit(patient);
        setIsModalOpen(true);
    }
    function handlePatientUpdated(updatedPatient){
        const updatedPatients = patients.map((patient) => 
            patient.id === updatedPatient.id ? updatedPatient : patient
        );
        setPatients(updatedPatients);
    }
    function DeletePatient(id){
        const confirm = window.confirm("voulez-vous vraiment supprimer ce patient ?");
        if(!confirm) return;
        const updatedPatients = patients.filter((patient) => patient.id !== id);
        setPatients(updatedPatients);
    }
   
    // filtre anle patients rechercherna
    const filteredPatients = patients.filter((patient) =>
        patient.nom?.toLowerCase().includes(search.toLowerCase()) ||
        patient.Prenom?.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone?.toLowerCase().includes(search.toLowerCase())
    )
    const urgenceColors ={
        1: "#4a90d9",
        2:"#4caf7d",
        3:"#e0b93e",
        4:"#f0662d",
        5:"#e24b4a"
    }
    return(
        <Layout>
            <div >
                <div className="Header-Patients">
                    <h1>Patients</h1>
                    <button className="Button-AddPatient" onClick={handleOpenAdd}>+ Ajouter un patient</button>
                </div>
                <div className="Container-SearchPatient">
                    <Search size={18} style={{margin:"10px"}} color="grey" />
                    <input type="text" 
                        placeholder="Rechercher un patient..." 
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}/>
                </div>
                <table >
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Téléphone</th>
                            <th>Urgence</th>
                            {/* <th>Salle</th>*/}
                            <th>Actions</th> 
                        </tr>
                    </thead>
                    { filteredPatients.length>0  ? (<tbody>
                        { filteredPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.nom}</td>
                                <td>{patient.Prenom}</td>
                                <td>{patient.phone}</td>
                                <td> <span
                                    style={{
                                        backgroundColor: urgenceColors[patient.niveau],
                                        color: "#fff",
                                        padding: "5px 10px",
                                        borderRadius: "25px",
                                        fontWeight: "bold"
                                    }}
                                >{patient.niveau}</span></td>
                                <td>
                                    <div>
                                    <button className="Button-Delete" onClick={() => DeletePatient(patient.id)}>
                                        <Trash2  size={21} color="red"/>
                                    </button>
                                    <button className="Button-Edit" onClick={() => handleOpenEdit(patient)}>
                                        <Pencil size={21} color="blue"/>
                                    </button>

                                    </div>
                                    
                                </td>
                                {/* <td>{patient.}</td> */}
                            </tr>
                        ))}
                    </tbody>) : <tbody><tr><td colSpan={5} style={{textAlign:"center", fontSize:"1rem"}}>Aucun patient(s) Enregistrer</td></tr></tbody>}
                  
                </table>
                {isModalOpen && (
                    <AddPatients
                        onClose={() => setIsModalOpen(false)}
                        onPatientAdded={handlePatients}
                        existingPhone={patients}
                        onPatientUpdated={handlePatientUpdated}
                        patientToEdit={edit}
                    />
                )}

            </div>
        </Layout>
    )
}