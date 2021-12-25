import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Filler,
  Tooltip,
  PointElement,
  LineElement
);

const RatingChart = ({ xLabels, yLabels }) => {
  useEffect(() => {
    console.log("rendering line chart...");
  }, [xLabels, yLabels]);

  const data = {
    labels: xLabels,
    datasets: [
      {
        data: yLabels,
        label: "Rating",
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.4)",
        borderColor: "rgba(16, 185, 129, 1)",
        pointBackgroundColor: "rgb(255,99,132)",
        borderWidth: 4,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    radius: 4,
    hoverRadius: 6,
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 0,
        to: 0.3,
        loop: false,
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default RatingChart;
