import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutGrid, BedDouble, User, Pill, 
  AlertTriangle, Move3D, LogOut, 
  Heart, Activity, Users, Clock 
} from "lucide-react";
import "./Sidebar.css";
import { patientService } from "../../services/patient.Service";
import { medicamentService } from "../../services/medicament.Service";
import { useEffect, useState } from "react";



function Sidebar() {
  
   const [Patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [Alertes, setAlertes] = useState([]);
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

  const menuItems = [
    { label: "Tableau de bord", path: "/dashboard", icon: LayoutGrid },
    { label: "Salles", path: "/rooms", icon: BedDouble },
    { label: "Patients", path: "/patients", icon: User, badge: `${Patients.length}` },
    { label: "Admission", path: "/admissions", icon: Users },
    { label: "Médicaments", path: "/medicaments", icon: Pill },
    { label: "Mouvements", path: "/mouvements", icon: Move3D },
    { label: "Alertes", path: "/alertes", icon: AlertTriangle, badge: `${Alertes.length}` },
  ];

  
  const location = useLocation();

  const loadPatients = async () => {
      try {
        const patients = await patientService.getAll();
        setPatients(patients.data.data);
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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {/* <div className="logo-icon">⚕️</div> */}
          <div className="logo-icon">
            <img src="src/assets/logo.png" alt="" width={60} height={60} />
          </div>
          <div className="logo-text">
            <div className="logo-main">
              <span>Hospi</span>Sync
            </div>
            <div className="logo-sub">Gestion hospitalière</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-section-title">Navigation principale</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={isActive ? "menu-item active" : "menu-item"}
              >
                <span className="menu-icon">
                  <Icon size={20} />
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="menu-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* <div className="menu-section">
          <div className="menu-section-title">Statistiques</div>
          <div className="menu-item" style={{ cursor: 'default' }}>
            <span className="menu-icon"><Users size={20} /></span>
            <span>Patients total</span>
            <span className="menu-badge" style={{ background: '#667eea' }}>156</span>
          </div>
          <div className="menu-item" style={{ cursor: 'default' }}>
            <span className="menu-icon"><Activity size={20} /></span>
            <span>En consultation</span>
            <span className="menu-badge" style={{ background: '#10b981' }}>18</span>
          </div>
        </div> */}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-item" onClick={()=>{navigate("/")}}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;