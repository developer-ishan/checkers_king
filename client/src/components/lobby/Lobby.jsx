import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";
import { getUserIdentification } from "../../helper/authHelper";

const Lobby = ({ heading }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const history = useHistory();

  const exitLobby = () => {
    const userId = getUserIdentification();
    socket.emit("exit-game-lobby", userId);
    history.goBack();
  };

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
      animationDuration: "12s",
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
      animationDuration: "18s",
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
      animationDuration: "45s",
      background: "rgba(255, 255, 255, 0.8)",
      bottom: "-10px",
    },
  ];
  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      className="relative bg-yellow-300 dark:bg-gray-900 capitalize"
    >
      <ul className="absolute inset-0 overflow-hidden list-none no-underline">
        {floatingObjects.map((object, index) => {
          let offset = Math.floor(Math.random() * 90 + 1);
          return (
            <li
              style={{
                ...object,
                animationDelay: "0s",
                bottom: "-100px",
                left: `${offset}%`,
              }}
              key={index}
              className="absolute block list-none animate-float-up"
            ></li>
          );
        })}
        {floatingObjects.map((object, index) => {
          let offset = Math.floor(Math.random() * 90 + 1);
          return (
            <li
              style={{
                ...object,
                animationDelay: "1s",
                bottom: "-300px",
                left: `${offset}%`,
              }}
              key={index}
              className="absolute block list-none animate-float-up"
            ></li>
          );
        })}
      </ul>
      <div className="absolute inset-0 grid place-content-center">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-6xl">{heading}</p>
        <button
          className="bg-red-700 text-white p-2 m-2 px-4 mx-4"
          onClick={exitLobby}
        >
          EXIT
        </button>
      </div>
    </div>
  );
};

export default Lobby;
