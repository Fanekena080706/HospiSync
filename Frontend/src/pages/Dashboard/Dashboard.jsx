
import './Dashboard.css';
import './assets/line awesome/css/line-awesome.min.css'
import AdmissionChart from './AdmissionChart';
import OccupationBar from './OccupationSalles';
import Layout from '../../components/layout/Layout';
function Dashboard() {
    // soloina amle ao anaty bd ftsn ireto
    const Patients = ["Rakoto", "Rabe", "Razafy", "Razily"];
    const Salles = [1, 2, 3, 4, 5];
    const Occupation = "80%";
    const Alertes = [{ nom: "Amoxi", quantite: 10 }, { nom: "Paracetamol", quantite: 5 }, { nom: "Insuline", quantite: 4 }, { nom: "Seringue", quantite: 0 },{ nom: "Seringue", quantite: 0 },{ nom: "Seringue", quantite: 0 },{ nom: "Seringue", quantite: 0 },{ nom: "Seringue", quantite: 0 },{ nom: "Seringue", quantite: 0 }];
    return (
        <Layout>
            <div className="main-content">
                <header>
                    <div className="header-title">
                        <h1>Bonjour Administrateur</h1>
                        <p>Voici un aperçu de la situation actuelle<span className="las la-chart-bar"></span></p>
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
                                    <h1>{Occupation}</h1>
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
                            <div className="alerte">
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