import React, { useEffect, useState, useContext } from "react";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";

const Game = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);

  const [game, setGame] = gameValue;
  const [color, setColor] = colorValue;

  // used for moving the piece of the player
  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", {
      selectedPiece,
      destination,
    });
  };

  return (
    <div className="text-center text-white">
      <h1>This Is A Game</h1>
      <p>Let The Game Begin...</p>
      <BoardComponent
        board={game.board}
        color={color}
        movePiece={movePiece}
        turn={game.turn}
      />
      <Chat />
    </div>
  );
};

export default Game;
