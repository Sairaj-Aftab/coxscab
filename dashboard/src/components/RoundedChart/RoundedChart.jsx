import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register the required components for the Pie chart
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

// eslint-disable-next-line react/prop-types
const RoundedChart = ({ title, labels, data }) => {
  const chartData = {
    labels: labels, //it's array
    datasets: [
      {
        label: "Value",
        data: data, //it's array number
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(165,42,42)",
        ],
        hoverOffset: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(0, 0, 0, 0.70)", // Customize legend label color
          font: {
            size: 12, // Customize font size
            family: "'Helvetica Neue', 'Arial', sans-serif", // Customize font family
            weight: "600", // Customize font weight
          },
          boxWidth: 10, // Adjust width of the color box (legend badge)
          boxHeight: 10, // Adjust height of the color box (legend badge)
          padding: 8, // Space between the legend labels and boxes
          usePointStyle: true, // Makes badge circular (optional)
        },
      },
      afterFit: (legend) => {
        legend.height = 100; // Set the width of the legend
      },
    },
  };
  return (
    <div className="bg-white rounded-md p-1 shadow-md">
      <h3 className="text-base font-medium text-gray_text mb-3">{title}</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default RoundedChart;
