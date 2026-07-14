import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Title, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const axeX = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const axeY = [65 , 20, 78, 40, 82, 56, 90];

function AdmissionChart() {
    const data = {
        labels: axeX,
        datasets: [
            {
                data: axeY,
                borderColor: "#396aff",
                backgroundColor: "rgba(104,131,219,0.2)",
                borderWidth: 3,
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
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        },
    };
    return(
        <div style={{ height : "200px"}}>
            <Line data={data} options={options}/>
        </div>
    );
}

export default AdmissionChart;

