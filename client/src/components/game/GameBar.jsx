import React, { useState } from "react";
import SmallScreenInfoModal from "../modal/SmallScreenInfoModal";
import Modal from "react-modal";
import GameActionButton from "./GameActionButton";
Modal.setAppElement("#root");

const GameBar = ({ turn, leaveGame, offerDraw, botLevel, gameId, color }) => {
  const [isGameOptionsModalOpen, setIsGameOptionsModalOpen] = useState(false);
  return (
    <div className="flex items-center w-full p-3 bg-indigo-400 ">
      {/* turn indicator */}
      <div className="">
        <p className="px-2 py-1 text-black capitalize bg-yellow-300 rounded-full">
          {turn === color ? "your turn" : "opponent's turn"}
        </p>
      </div>
      <button
        className="p-1 ml-auto bg-gray-200 rounded-full sm:hidden"
        onClick={() => setIsGameOptionsModalOpen(true)}
      >
        <img
          src="https://img.icons8.com/ios-filled/50/000000/menu--v1.png"
          className="w-3 h-3"
        />
      </button>
      <div className="hidden ml-auto sm:block">
        <GameActionButton
          leaveGame={leaveGame}
          offerDraw={offerDraw}
          gameId={gameId}
          botLevel={botLevel}
        />
      </div>
      {/* audio controls */}
      {/* maybe count of kitni goti kati */}
      <SmallScreenInfoModal
        title="game Options"
        modalState={isGameOptionsModalOpen}
        setModalState={setIsGameOptionsModalOpen}
      >
        <GameActionButton
          leaveGame={leaveGame}
          offerDraw={offerDraw}
          gameId={gameId}
          botLevel={botLevel}
        />
      </SmallScreenInfoModal>
    </div>
  );
};

export default GameBar;
