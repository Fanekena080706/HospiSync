// Navbar.jsx
import { Search } from "lucide-react";
import "./Navbar.css";
function Navbar() {
  return (
    <header className="navbar">
        <div className="navbar-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search patients, rooms, or staff..." />
      </div>

      <div className="navbar-right">
            <div className="navbar-profile">
                <div className="profile-text">
                    <p className="profile-name">Dr. Liantsoa R</p>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    alt="Dr. Julian Vance"
                    className="profile-avatar"
                />
            </div>
        </div>
    </header>
  );
}

export default Navbar;