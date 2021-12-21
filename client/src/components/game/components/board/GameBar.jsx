import React, { useState } from "react";
import SmallScreenInfoModal from "../../../modal/SmallScreenInfoModal";
import Modal from "react-modal";
import GameActionButton from "./GameActionButton";
Modal.setAppElement("#root");

const GameBar = ({ turn, leaveGame, offerDraw, botLevel, gameId, color }) => {
  const [isGameOptionsModalOpen, setIsGameOptionsModalOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-row items-center px-2 py-2 bg-transparent">
        {/* turn indicator */}
        <p className="px-2 py-1 text-black capitalize bg-yellow-300 rounded-full ">
          {color && (turn === color ? "your turn" : "opponent's turn")}
          {!color && `${turn} player's turn`}
        </p>
        <div className="ml-auto">
          {/* hamburger button */}
          <button
            className="p-1 ml-auto bg-white rounded-full sm:hidden"
            onClick={() => setIsGameOptionsModalOpen(true)}
          >
            <img
              src="https://img.icons8.com/ios-filled/50/000000/menu--v1.png"
              className="w-3 h-3"
            />
          </button>
          {/* controls on full screen size */}
          <div className="hidden float-right sm:inline-block">
            <GameActionButton
              leaveGame={leaveGame}
              offerDraw={offerDraw}
              gameId={gameId}
              botLevel={botLevel}
              color={color}
            />
          </div>
        </div>

        {/* audio controls */}
        {/* maybe count of kitni goti kati */}

        {/* modal containing controls for small screen size */}
      </div>

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
