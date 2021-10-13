import React from "react";

const JoinGame = () => {
  return (
    <div class="flex flex-col items-center justify-center w-full h-auto px-2  bg-white sm:rounded-lg sm:shadow-xl">
      <div class="mt-10 mb-10 text-center">
        <h2 class="text-2xl font-semibold mb-2">Have a Game code?</h2>
        <p class="text-xs text-gray-500">
          enter the code below to join the game
        </p>
      </div>
      <form action="#">
        <input
          type="text"
          id="game-id"
          placeholder="enter game code"
          class="placeholder-gray-600 focus:placeholder-gray-400 border-dashed border-4 w-full border-yellow-300 active:ring-yellow-300 focus:border-yellow-300 focus:ring-yellow-300"
        />
        <br />
        <button class="bg-indigo-500 text-white p-2 rounded capitalize my-3 w-full">
          join game
        </button>
      </form>
    </div>
  );
};

export default JoinGame;
