// Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, BedDouble, User,  Pill,   } from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { label: "Tableau de bord", path: "/dashboard", icon: LayoutGrid },
  { label: "Salles", path: "/rooms", icon: BedDouble },
  { label: "Patients", path: "/patients", icon: User },
  { label: "Medicaments", path: "/medications", icon: Pill },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div>
        <h1 className="sidebar-logo">HospiSync</h1>
        <p className="sidebar-subtitle">Gestion hospitalière</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon; // on renomme 
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={isActive ? "menu-item active" : "menu-item"}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

		  
    </aside>
  );
}

export default Sidebar;