import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Rooms from "./pages/Rooms/Rooms";
import Alertes from "./pages/Alertes/Alertes";
import "./App.css";
import Mouvements from "./pages/Mouvement/Mouvement";
/* import Patients from "./pages/Patients/Patients"; */
import Medicament from "./pages/Medications/Medications";
import Patients from "./pages/Patients/Patients";
import Admission from "./pages/Admissions/Admissions";
import Register from "./pages/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/alertes" element={<Alertes />} />
        <Route path="/mouvements" element={<Mouvements />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/medicaments" element={<Medicament />} />
        <Route path="/admissions" element={<Admission />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;