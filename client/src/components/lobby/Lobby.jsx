import React from "react";

const Lobby = ({ heading }) => {
  const floatingObjects = [
    {
      width: "80px",
      height: "80px",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "20px",
      height: "20px",
      "animation-duration": "12s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "20px",
      height: "20px",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "60px",
      height: "60px",
      "animation-duration": "18s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "20px",
      height: "20px",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "110px",
      height: "110px",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "150px",
      height: "150px",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
    {
      width: "25px",
      height: "25px",
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
          let offset = Math.floor(Math.random() * 90 + 1);
          return (
            <li
              style={{
                ...object,
                "animation-delay": "0s",
                bottom: "-100px",
                left: `${offset}%`,
              }}
              className="absolute block list-none animate-float-up"
            ></li>
          );
        })}
        {floatingObjects.map((object) => {
          let offset = Math.floor(Math.random() * 90 + 1);
          return (
            <li
              style={{
                ...object,
                "animation-delay": "1s",
                bottom: "-300px",
                left: `${offset}%`,
              }}
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
