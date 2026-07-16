import "./Dashboard.css";
import "./assets/line awesome/css/line-awesome.min.css";
import AdmissionChart from "./AdmissionChart";
import OccupationBar from "./OccupationSalles";
import Layout from "../../components/layout/Layout";

//donée
import { patientService } from "../../services/patient.Service";
import { salleService } from "../../services/salle.Service";
import { useEffect, useState } from "react";
import { medicamentService } from "../../services/medicament.Service";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const [Patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Alertes, setAlertes] = useState([]);
  const [Salles, setSalle] = useState([]);
  const [user, setUser] = useState([]);

  const location = useLocation();

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

  // soloina amle ao anaty bd ftsn ireto
  //   Patients = ["Rakoto", "Rabe", "Razafy", "Razily"];
  //   const Salles = [1, 2, 3, 4, 5];

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
  let Occupation = Math.floor(somme / pt.length);

  return (
    <Layout>
      <div className="main-content">
        <header>
          <div className="header-title">
            <h1>Bonjour!</h1>
            <p>
              Voici un aperçu de la situation actuelle
              <span className="las la-chart-bar"></span>
            </p>
          </div>
        </header>
        <main>
          <section>
            <h3 className="section-head">Vue d'ensemble</h3>
            <div className="analytics">
              <div className="analytic">
                <div className="analytic-icon">
                  <span className="las la-user-injured"></span>
                </div>
                <div className="analytic-info">
                  <h4>Patients</h4>
                  <h1>{Patients.length}</h1>
                </div>
              </div>

              <div className="analytic">
                <div className="analytic-icon">
                  <span className="las la-bed"></span>
                </div>
                <div className="analytic-info">
                  <h4>Salles</h4>
                  <h1>{Salles.length}</h1>
                </div>
              </div>

              <div className="analytic">
                <div className="analytic-icon">
                  <span className="las la-chart-pie"></span>
                </div>
                <div className="analytic-info">
                  <h4>Occupation</h4>
                  <h1>{Occupation}%</h1>
                </div>
              </div>

              <div className="analytic">
                <div className="analytic-icon">
                  <span className="las la-exclamation-triangle"></span>
                </div>
                <div className="analytic-info">
                  <h4>Alerte de stock</h4>
                  <h1>{Alertes.length}</h1>
                </div>
              </div>
            </div>
          </section>
          <section className="Graphs">
            <div className="Graph1">
              <h5 className="graph-title">Évolution des admisions</h5>
              <AdmissionChart />
            </div>
            <div className="Graph1">
              <h5 className="graph-title">Occupation des salles(%)</h5>
              <OccupationBar />
            </div>
          </section>

          <section className="alertes">
            {Alertes.map((medicament) => (
              <div className="alerte" key={medicament._id}>
                <span className="las la-exclamation-triangle"></span>
                <div className="About">
                  <h4>{medicament.nom}</h4>
                  <p>Quantité: {medicament.quantite}</p>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </Layout>
  );
}

export default Dashboard;
