import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { admissionService } from "../../services/admission.Service";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

const axeX = [];
const axeY = [];

function AdmissionChart() {
  const [Admission, setAdmission] = useState([]);

  const chargeAdmission = async () => {
    try {
      const response = await admissionService.admissionParSemaine();
      console.log(response.data.jours);
      setAdmission(response.data.jours);
    } catch (err) {
      console.log(err);
    }
  };
  for (const a of Admission) {
    axeX.push(a.jour);
    axeY.push(a.nombre_admissions);
  }
  useEffect(() => {
    chargeAdmission();
  }, []);
  const data = {
    labels: axeX,
    datasets: [
      {
        data: axeY,
        borderColor: "#396aff",
        backgroundColor: "rgba(104,131,219,0.2)",
        borderWidth: 1.5,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#4b5876",
          fontSize: "smaller",
        },
        max: 6,
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div style={{ height: "200px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default AdmissionChart;
