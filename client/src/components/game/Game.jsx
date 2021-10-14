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
  const [gameId, setGameId] = useState(null);
  let history = useHistory();

  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", { selectedPiece, destination });
  };

  const leaveRoom = () => {
    socket.emit("leave-room", { roomId: gameId });
    if (game.id != null) {
      console.log("goBack() called...");
      history.goBack();
    }
  };

  const quitGame = () => {
    socket.emit("quit-game");
  };

  useEffect(() => {
    socket.on("game-status", (game) => {
      setGame(game);
      setGameId(game.id);
    });

    socket.on("color", (color) => {
      setColor(color);
    });

    socket.on("winner", (winner) => {
      console.log("winner event caught...");
      alert("Winner of the game is ", winner);
      leaveRoom();
    });
  }, []);

  useEffect(() => {
    socket.on("end-game", () => {
      console.log("end-game event caught...");
      leaveRoom();
    });
  }, []);

  useEffect(() => {
    return () => {
      setGameId(null);
      setColor(null);
    };
  }, []);

  return (
    <div className="text-center text-white">
      <h1>This is a Game</h1>
      <p>Game ID :- {gameId}</p>
      <BoardComponent
        board={game.board}
        color={color}
        turn={game.turn}
        movePiece={movePiece}
        leaveRoom={leaveRoom}
        quitGame={quitGame}
      />
      <Chat />
    </div>
  );
};

export default Game;
