import React from "react";

const Lobby = ({ heading }) => {
  const floatingObjects = [
    {
      left: "25%",
      width: "80px",
      height: "80px",
      "animation-delay": "0s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "10%",
      width: "20px",
      height: "20px",
      "animation-delay": "0s",
      "animation-duration": "12s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "70%",
      width: "20px",
      height: "20px",
      "animation-delay": "0s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "40%",
      width: "60px",
      height: "60px",
      "animation-delay": "0s",
      "animation-duration": "18s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "65%",
      width: "20px",
      height: "20px",
      "animation-delay": "0s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "75%",
      width: "110px",
      height: "110px",
      "animation-delay": "0s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "35%",
      width: "150px",
      height: "150px",
      "animation-delay": "0s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      left: "50%",
      width: "25px",
      height: "25px",
      "animation-delay": "0s",
      "animation-duration": "45s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
  ];
  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      className="relative bg-yellow-300 dark:bg-gray-900"
    >
      <ul class="absolute inset-0 overflow-hidden list-none no-underline">
        {floatingObjects.map((object) => {
          return (
            <li
              style={object}
              className="absolute block list-none animate-float-up"
            ></li>
          );
        })}
      </ul>
      <div className="absolute inset-0 grid place-content-center">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-6xl">{heading}</p>
      </div>
    </div>
  );
};

export default Lobby;
