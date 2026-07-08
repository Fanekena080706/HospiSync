import Layout from "../../components/layout/Layout";

function Dashboard() {
  return (
    	<Layout>
      		<h1>Tableau de bord</h1>
      		<div className="stats">
        		<div className="stat-card">Patients aujourd'hui : 12</div>
        		<div className="stat-card">Rendez-vous : 5</div>
      		</div>
    	</Layout>
  	);
}

export default Dashboard;