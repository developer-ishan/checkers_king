import React from "react";
import { useHistory } from "react-router";
import { isAuthenticated } from "../../../helper/authHelper";

const CreateGame = ({ socket }) => {
  let history = useHistory();
  // creates a new and redirects us to the game board
  const createGame = () => {
    const token = isAuthenticated();
    // ARGS :- ("create-game", Game-Title, isBot, mandatoryMoves, token)
    socket.emit("create-game", "need to chang this", true, true, token);
    history.push("/game");
  };
  return (
    <div className="relative grid w-full h-64 bg-white sm:h-full sm:rounded-lg sm:shadow-xl place-content-center">
      <img
        src="/images/flame-vr-game.png"
        className="absolute transform inset-x-2/4 inset-y-2/4 -translate-x-2/4 -translate-y-2/4"
        alt="game image"
      />
      <div className="absolute rounded inset-1 opacity-70 bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-400"></div>
      <div className="absolute inset-0 transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
        <a
          href="#"
          onClick={() => createGame()}
          className="block table p-2 p-4 mx-auto text-white capitalize transform border-4 border-dashed rounded-full hover:scale-150 active:scale-150 align place-content-center"
        >
          <img src="https://img.icons8.com/android/24/000000/plus.png" />
        </a>
        <p className="w-full mt-3 font-bold text-center text-white">New Game</p>
      </div>
    </div>
  );
};

export default CreateGame;
