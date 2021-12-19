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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  PointElement,
  LineElement
);

const RatingChart = ({ userId, previousMatches }) => {
  var xLabels = [];
  var yData = [];

  useEffect(() => {
    let currRating = 800,
      matchNumber = 0;
    xLabels.push(matchNumber.toString());
    yData.push(currRating);

    for (let itr = previousMatches.length - 1; itr >= 0; --itr) {
      matchNumber++;
      xLabels.push(matchNumber.toString());
      if (previousMatches[itr].players[0].id === userId) {
        currRating += previousMatches[itr].players[0].ratingChange;
        yData.push(currRating);
      } else {
        currRating += previousMatches[itr].players[1].ratingChange;
        yData.push(currRating);
      }
    }
    // console.log(xLabels);
    // console.log(yData);
  }, [previousMatches]);

  return (
    <div>
      <p>Rating Chart</p>
      <Line
        data={{
          // x-axis label values
          labels: xLabels,
          datasets: [
            {
              label: "Match Ratings",
              // y-axis data plotting values
              data: yData,
              fill: false,
              borderWidth: 2,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "green",
              responsive: true,
            },
          ],
        }}
        options={{
          title: { display: true, text: "User Ratings History", fontSize: 20 },
          legend: { display: true, position: "right" },
        }}
      />
    </div>
  );
};

export default RatingChart;
