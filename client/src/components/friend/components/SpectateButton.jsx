import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../../context/SocketContext";
import { getUserIdentification } from "../../../helper/authHelper";

const SpectateButton = ({ gameId }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const history = useHistory();
  const handleSectateGame = () => {
    const token = getUserIdentification();
    socket.emit("join-game", gameId, token);
    history.push("/game");
  };
  return (
    <div className="">
      <button
        className="block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
        onClick={handleSectateGame}
      >
        Spectate
      </button>
    </div>
  );
};

export default SpectateButton;
