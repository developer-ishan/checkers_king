import React, { useState } from "react";
import { useHistory } from "react-router";
import { getUserIdentification } from "../../../../helper/authHelper";
import GameButton from "../others/GameButton";

const JoinGame = ({ socket }) => {
  const [gameId, setGameId] = useState("");
  const history = useHistory();

  const joinGame = (e) => {
    const token = getUserIdentification();
    socket.emit("join-game", gameId, token);
    history.push("/game");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto px-2  bg-white dark:bg-gray-700 rounded-lg sm:shadow-xl">
      <div className="mt-10 mb-10 text-center">
        <h2 className="text-xl dark:text-white sm:text-2xl  lg:text-3xl font-semibold mb-2">
          Have A Game Code?
        </h2>
        <p className="text-xs text-gray-500 dark:text-white">
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
          autoComplete="off"
          className="text-gray-400 text-center dark:bg-gray-700 placeholder-gray-400  border-dashed border-4 w-full border-yellow-300 active:ring-yellow-300 focus:border-yellow-300 focus:ring-yellow-300"
        />
        <br />
        {/* <button
          className="bg-indigo-500 text-white p-2 rounded capitalize my-3 w-full"
          onClick={joinGame}
        >
          Join Game
        </button> */}
        <GameButton
          className="block w-3/4 p-2 mx-auto my-5 text-white bg-indigo-500"
          shadowColor="#FBC638"
          onClickFn={() => joinGame()}
        >
          JoinGame
        </GameButton>
      </form>
    </div>
  );
};

export default JoinGame;
