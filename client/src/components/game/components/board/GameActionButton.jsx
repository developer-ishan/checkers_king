import introJs from "intro.js";
import React, { useContext, useState } from "react";
import { GameSoundContext } from "../../../../context/GameSoundContext";

const GameActionButton = ({
  offerDraw,
  leaveGame,
  botLevel,
  gameId,
  color,
}) => {
  const [isCopied, setCopied] = useState(false);
  const { clickSound, isMuted, selectSound } = useContext(GameSoundContext);
  const handleCopy = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 400);
  };
  return (
    <div
      id="gameRelatedInfo"
      className="flex flex-col items-center w-full ml sm:w-auto sm:flex-row"
    >
      <p className="relative flex items-center justify-center w-full max-w-xs px-4 py-2 m-1 text-xs font-bold text-center text-white bg-gray-400 rounded">
        {gameId}
        <span
          className="mx-1 cursor-pointer"
          onClick={() => {
            handleCopy();
            if (!isMuted) selectSound.play();
          }}
        >
          <img
            src="https://img.icons8.com/material-outlined/24/000000/copy.png"
            className=""
          />
        </span>
        {isCopied && (
          <p className="absolute inset-0 grid bg-indigo-300 rounded place-content-center">
            copied!
          </p>
        )}
      </p>
      {/* offer draw button only show if not playing against bot */}
      {botLevel === -1 && color && (
        <button
          className="w-full max-w-xs px-4 py-2 m-1 text-xs font-bold text-white uppercase transition-all duration-150 bg-yellow-500 rounded shadow outline-none sm:w-auto active:bg-red-600 hover:shadow-md hover:bg-yellow-600 focus:outline-none ease"
          onClick={() => {
            offerDraw();
            if (!isMuted) clickSound.play();
          }}
        >
          draw
        </button>
      )}
      {/* quit btn for players and leave btn for spectators*/}
      {/* leave game is working for both because inside the leaveGame functino
        there is a condition which check where to call quit or leave
      */}
      <button
        className="w-full max-w-xs px-4 py-2 m-1 text-xs font-bold text-white uppercase transition-all duration-150 bg-red-500 rounded shadow outline-none sm:w-auto active:bg-red-600 hover:shadow-md hover:bg-red-600 focus:outline-none ease"
        onClick={() => {
          leaveGame();
          if (!isMuted) clickSound.play();
        }}
      >
        {color ? "quit" : "leave"}
      </button>
      <button
        className="w-full max-w-xs px-4 py-2 m-1 text-xs font-bold text-white uppercase transition-all duration-150 bg-gray-500 rounded shadow outline-none sm:w-auto active:bg-red-600 hover:shadow-md hover:bg-gray-600 focus:outline-none ease"
        data-hint="click on this button to take tour of website"
        data-hintposition="top-left"
        onClick={() => {
          introJs().start();
          clickSound.play();
        }}
      >
        take tour!
      </button>
    </div>
  );
};

export default GameActionButton;
