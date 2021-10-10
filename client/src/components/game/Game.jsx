import React from "react";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

function Game() {
  return (
    <div className="text-center text-white">
      <h1>This Is A Game</h1>
      <p>Let The Game Begin...</p>
      <BoardComponent />
      <Chat />
    </div>
  );
}

export default Game;
