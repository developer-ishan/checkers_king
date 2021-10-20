import React from "react";
import { useHistory } from "react-router";
import { isAuthenticated } from "../../../helper/authHelper";
import GameButton from "../../game/GameButton";

const CreateGame = ({ socket }) => {
  let history = useHistory();
  // creates a new and redirects us to the game board
  const createGame = () => {
    const token = isAuthenticated();
    // ARGS :- ("create-game", isBot, mandatoryMoves, token)
    socket.emit("create-game", false, 4, "Red", true, true, token);
    history.push("/game");
  };
  return (
    <div className="relative grid w-full h-64 bg-white sm:h-full sm:rounded-lg sm:shadow-xl place-content-center">
      <img
        src="/images/flame-vr-game.png"
        className="absolute transform inset-x-2/4 inset-y-2/4 -translate-x-2/4 -translate-y-2/4"
        alt="game image"
      />
      <div className="absolute inset-0 rounded opacity-70 indigo-gradient dark:dark-gradient dark:bg-opacity-100 "></div>
      <GameButton
        className="absolute p-2 font-bold text-indigo-500 transform bg-white top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
        onClickFn={() => createGame()}
      >
        New Game
      </GameButton>
    </div>
  );
};

export default CreateGame;
