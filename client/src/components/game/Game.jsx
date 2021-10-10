import React, { useEffect } from "react";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

const Game = ({ game, color }) => {
  useEffect(() => {
    console.log(game);
    console.log(color);
  }, []);

  return (
    <div className="text-center text-white">
      <h1>This Is A Game</h1>
      <p>Let The Game Begin...</p>
      <BoardComponent />
      <Chat />
    </div>
  );
};

export default Game;
