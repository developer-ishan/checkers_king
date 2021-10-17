import React, { useState } from "react";
import { useHistory } from "react-router";
import { isAuthenticated } from "../../../helper/authHelper";

const JoinGame = ({ socket }) => {
  const [gameId, setGameId] = useState("");
  const history = useHistory();
  // joins us to the game with game_id 0 for now
  // TODO: catching error on joining non-existent gaem
  const joinGame = (e) => {
    const token = isAuthenticated();
    socket.emit("join-game", gameId, token);
    history.push("/game");
  };

  return (
    <div class="flex flex-col items-center justify-center w-full h-auto px-2  bg-white sm:rounded-lg sm:shadow-xl">
      <div class="mt-10 mb-10 text-center">
        <h2 class="text-xl sm:text-2xl  lg:text-3xl font-semibold mb-2">
          Have A Game Code?
        </h2>
        <p class="text-xs text-gray-500">
          Enter The Code Below To Join The Game
        </p>
      </div>
      <form action="#">
        <input
          type="text"
          id="game-id"
          value={gameId}
          onChange={(e) => {
            setGameId(e.target.value);
          }}
          placeholder="Enter Game Code"
          class="placeholder-gray-600 focus:placeholder-gray-400 border-dashed border-4 w-full border-yellow-300 active:ring-yellow-300 focus:border-yellow-300 focus:ring-yellow-300"
        />
        <br />
        <button
          class="bg-indigo-500 text-white p-2 rounded capitalize my-3 w-full"
          onClick={joinGame}
        >
          Join Game
        </button>
      </form>
    </div>
  );
};

export default JoinGame;
