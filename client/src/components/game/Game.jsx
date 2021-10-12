import React, { useEffect, useContext } from "react";
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

  // used for moving the piece of the player
  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", {
      selectedPiece,
      destination,
    });
  };

  useEffect(() => {
    socket.on("game-status", (game) => {
      console.log(game);
      setGame(game);
    });

    socket.on("color", (color) => {
      console.log("color", color);
      setColor(color);
    });

    socket.on("end-game", () => {
      history.goBack();
    });
  }, []);

  const leaveGame = () => {
    console.log("gameId", game.id);
    if (color !== null) socket.emit("leave-game");
    else socket.emit("leave-room", { roomId: game.id });
    history.goBack();
  };

  useEffect(() => {
    return () => {
      console.log("gameId", game.id);
      setColor(null);
    };
  }, []);

  return (
    <div className="text-center text-white">
      <h1>This Is A Game</h1>
      <p>Let The Game Begin...</p>
      <BoardComponent
        board={game.board}
        color={color}
        movePiece={movePiece}
        leaveGame={leaveGame}
        turn={game.turn}
      />
      <Chat />
    </div>
  );
};

export default Game;
