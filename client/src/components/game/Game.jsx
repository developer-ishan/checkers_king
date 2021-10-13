import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";

const Game = () => {
  let history = useHistory();

  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);

  const [game, setGame] = gameValue;
  const [color, setColor] = colorValue;
  const [gameId, setGameId] = useState(null);

  // used for moving the piece of the player
  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", {
      selectedPiece,
      destination,
    });
  };

  useEffect(() => {
    socket.on("game-status", (game) => {
      console.log("game-status triggered...");
      console.log(game);
      setGameId(game.id);
      setGame(game);
    });

    socket.on("color", (color) => {
      console.log("color event triggered...");
      console.log("color", color);
      setColor(color);
    });

    socket.on("end-game", () => {
      console.log("end-game event triggered...");
      leaveRoom();
    });

    socket.on("winner", (winner) => {
      console.log("winner event triggered...");
      console.log({ roomId: gameId });
      console.log(game);
      socket.emit("leave-room", { roomId: gameId });
      // alert("Winner of the game is " + winner);
      console.log("Winner : ", winner);
      console.log(winner);
      console.log("current-game", game);
      console.log({ roomId: gameId });
      // history.goBack();
    });
  }, []);

  const leaveRoom = () => {
    console.log("leave room function called...");
    console.log("gameId", game.id);
    console.log(gameId);
    socket.emit("leave-room", { roomId: gameId });
    history.goBack();
  };

  const quitGame = () => {
    console.log("calling quit game function...");
    socket.emit("quit-game");
  };

  useEffect(() => {
    return () => {
      console.log("exiting the UI gameId...", game.id);
    };
  }, []);

  return (
    <div className="text-center text-white">
      <h1>This Is A Game</h1>
      <p>Let The Game Begin...</p>
      <p>Game ID :- {gameId}</p>
      <BoardComponent
        board={game.board}
        color={color}
        movePiece={movePiece}
        leaveRoom={leaveRoom}
        quitGame={quitGame}
        turn={game.turn}
      />
      <Chat />
    </div>
  );
};

export default Game;
