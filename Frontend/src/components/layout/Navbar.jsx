import { Bell, Calendar, Settings, Clock, Users, Activity } from "lucide-react";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { medicamentService } from "../../services/medicament.Service";
import { patientService } from "../../services/patient.Service";
import { salleService } from "../../services/salle.Service";

function Navbar() {
  const [Patients, setPatients] = useState([]);
  const [Alertes, setAlertes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Salles, setSalle] = useState([]);
  const [user, setUser] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  // Récupérer l'heure et le jour
  const now = new Date();
  const hours = now.getHours();
  let greeting = "Bonjour";
  if (hours >= 18) greeting = "Bonsoir";
  else if (hours >= 12) greeting = "Bon après-midi";
  
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const date = now.toLocaleDateString('fr-FR', options);

   const loadPatients = async () => {
       try {
         const patients = await patientService.getAll();
         const salles = await salleService.getAll();
         setPatients(patients.data.data);
         setSalle(salles.data.data);
         setIsLoading(false);
       } catch (err) {
         console.error(err);
       }
     };

  const alertesMedicament = async () => {
    try {
      const response = await medicamentService.alertes();
      setAlertes(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setUser(location.state?.user);
    loadPatients();
    alertesMedicament();
  }, []);
/* 
  const pt = [];
  for (const sal of Salles) {
    let tmp = ((sal.capacite - sal.lits_disponibles) / sal.capacite) * 100;
    tmp = Math.floor(tmp);
    pt.push(tmp);
  }
  let somme = 0;
  for (const b of pt) {
    somme += b;
  }
  let Occupation = Math.floor(somme / pt.length); */
  
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* <div className="navbar-greeting">
          <span className="greeting-text">{greeting} 👋</span>
          <h2 className="greeting-title">Dr. Liantsoa Rakoto</h2>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {date}
          </span>
        </div> */}
        
        <div className="navbar-stats">
          <div className="stat-item">
            <Clock size={16} color="#f59e0b" />
            {/*<span className="stat-label">En attente</span>
             <span className="stat-value">6</span> */}
           <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {date} :
          </span>
          </div>
          <div className="stat-item">
            <Users size={16} color="#667eea" />
            <span className="stat-label">Patients</span>
            <span className="stat-value highlight">{Patients.length}</span>
          </div>
          {/* <div className="stat-item">
            <Activity size={16} color="#10b981" />
            <span className="stat-label">Occupation</span>
            <span className="stat-value">{parseInt(Occupation)}</span>
          </div> */}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-actions">
          
          <button className="action-btn" title="Notifications" onClick={()=>navigate("/alertes")}>
            <Bell size={20} />
            <span className="badge">{Alertes.length}</span>
          </button>
          
        </div>
        
        <div className="navbar-profile">
          <div className="profile-text">
            <p className="profile-name">Dr. Liantsoa R.</p>
            <p className="profile-role">Administrateur</p>
          </div>
          <div className="profile-avatar-wrapper">
            <img
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="Dr. Liantsoa R."
              className="profile-avatar"
            />
            <span className="profile-status"></span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;