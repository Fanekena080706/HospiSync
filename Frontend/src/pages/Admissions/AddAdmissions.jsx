import { useEffect, useState } from "react";
import "./AddAdmissions.css";
import { X, User, Bed, AlertCircle, Info } from "lucide-react";
import { patientService } from "../../services/patient.Service";
import { salleService } from "../../services/salle.Service";
import { admissionService } from "../../services/admission.Service";

function AddAdmissions({ admission, onClose, onSuccess }) {
  const [patients, setPatients] = useState([]);
  const [salles, setSalles] = useState([]);
  const [patientId, setPatientId] = useState(admission?.patient?.nom || "");
  const [salleId, setSalleId] = useState(admission?.salle?.nom || "");
  const [status, setStatus] = useState(admission?.status || "Hospitalisé");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!admission) {
      loadPatientsDisponibles();
      loadSallesDisponibles();
    } else {
      // En mode édition, on charge toutes les données
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    try {
      const [patientsRes, sallesRes] = await Promise.all([
        patientService.getAll(),
        salleService.getAll()
      ]);
      setPatients(patientsRes.data.data);
      setSalles(sallesRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPatientsDisponibles = async () => {
    try {
      const patientsRes = await patientService.getAll();
      const admissionsRes = await admissionService.getAll();
      const patientsHospitalises = admissionsRes.data.data
        .filter(a => a.status === "Hospitalisé")
        .map(a => a.patient._id);
      const disponibles = patientsRes.data.data.filter(
        p => !patientsHospitalises.includes(p._id)
      );
      setPatients(disponibles);
      
      if (disponibles.length === 0) {
        setInfo("Aucun patient disponible pour une nouvelle admission.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSallesDisponibles = async () => {
    try {
      const response = await salleService.getAll();
      const disponibles = response.data.data.filter(
        salle => salle.lits_disponibles > 0
      );
      setSalles(disponibles);
      
      if (disponibles.length === 0) {
        setInfo(info ? info + " Aucune salle disponible." : "Aucune salle disponible.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let response;
      if (admission) {
        response = await admissionService.update(admission._id, { status });
      } else {
        // Vérifier que le patient et la salle sont sélectionnés
        if (!patientId || !salleId) {
          setError("Veuillez sélectionner un patient et une salle.");
          setIsLoading(false);
          return;
        }
        
        response = await admissionService.create({
          nomPatient: patientId,
          nomSalle: salleId,
          status: status
        });
      }
      
      onSuccess(response.data.data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientDisplay = (p) => {
    return `${p.nom} ${p.prenom}`;
  };

  const getSalleDisplay = (s) => {
    return `${s.numero} - ${s.nom} (${s.lits_disponibles} places disponibles)`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="modal-icon">
              {admission ? <User size={18} /> : <Bed size={18} />}
            </span>
            {admission ? "Modifier l'admission" : "Nouvelle admission"}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {info && (
          <div className="form-info">
            <Info size={16} />
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!admission ? (
            <>
              <div className="form-group">
                <label>
                  Patient <span className="required">*</span>
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                >
                  <option value="">Choisir un patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p.nom}>
                      {getPatientDisplay(p)} {p.telephone ? `- ${p.telephone}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Salle <span className="required">*</span>
                </label>
                <select
                  value={salleId}
                  onChange={(e) => setSalleId(e.target.value)}
                  required
                >
                  <option value="">Choisir une salle</option>
                  {salles.map((s) => (
                    <option key={s._id} value={s.nom}>
                      {getSalleDisplay(s)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Patient</label>
                <input
                  value={`${admission.patient?.nom} ${admission.patient?.prenom}`}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Salle</label>
                <input
                  value={`${admission.salle?.numero} - ${admission.salle?.nom}`}
                  disabled
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>
              Statut <span className="required">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Hospitalisé">Hospitalisé</option>
              <option value="Sorti">Sorti</option>
              <option value="Transféré">Transféré</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Traitement..." : (admission ? "Modifier" : "Admettre")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdmissions;