import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const axeX = ["Salle A", "Salle B", "Salle C", "Salle D"];
const axeY = [90 , 40, 70, 30];
const couleurs = ["#2EC3A3","#F4C542","#F28C28","rgba(255, 0, 0, 0.5)"];
function OccupationBar() {
    const data = {
        labels: axeX,
        datasets: [
            {
                data: axeY,
                borderColor: "#396aff",
                backgroundColor: axeY.map((v) => {
                    if(v < 50) return couleurs[0];
                    if(v < 75) return couleurs[1];
                    if(v < 90) return couleurs[2];
                    return couleurs[3];
                }),
                borderRadius:5
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
                ticks: {
                    color: "#4b5876",
                },
                beginAtZero: true,
                max: 100,
                grid: {
                    color: "rgba(0,0,0,0.05)",
                },
                border: {
                    display: false,
                }
            },
            x: {
                ticks: {
                    color: "#4b5876",
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                }
            }
        },
    };
    return(
        <div style={{ height : "200px"}}>
            <Bar data={data} options={options}/>
        </div>
    );
}

export default OccupationBar;

