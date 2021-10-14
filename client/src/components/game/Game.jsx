import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";

const Game = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);

  const [game, setGame] = gameValue;
  const [color, setColor] = colorValue;
  let history = useHistory();

  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", { selectedPiece, destination });
  };

  const quitGame = () => {
    socket.emit("quit-game");
  };

  useEffect(() => {
    socket.on("game-status", (game) => {
      setGame(game);
    });

    socket.on("color", (color) => {
      setColor(color);
    });

    socket.on("winner", (winner) => {
      console.log("winner event caught...");
      console.log("Winner of the game is ", winner);
    });

    socket.on("end-game", () => {
      console.log("end-game event caught...");
    });
  }, []);

  return (
    <div className="text-center text-white">
      <h1>This is a Game</h1>
      <p>Game ID :- {game.id}</p>
      <BoardComponent
        board={game.board}
        color={color}
        turn={game.turn}
        movePiece={movePiece}
        quitGame={quitGame}
      />
      <Chat />
    </div>
  );
};

export default Game;
