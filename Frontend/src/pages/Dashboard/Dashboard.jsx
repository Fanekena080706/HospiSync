import Layout from "../../components/layout/Layout";
import "./Dashboard.css"
function Dashboard() {
  return (
    	<Layout>
      		<h1>Tableau de bord</h1>

      		<div className="stats">

        		<div className="stat-card">
					<h3 className="stat-name">Salles</h3>
					<p className="stat-number">40</p>
				</div>

				<div className="stat-card">
					<h3 className="stat-name">Patients</h3>
					<p className="stat-number">20</p>
				</div>
        		
      		</div>
    	</Layout>
  	);
}

export default Dashboard;