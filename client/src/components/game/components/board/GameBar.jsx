import React, { useState, useEffect, useContext } from "react";
import SmallScreenInfoModal from "../../../modal/SmallScreenInfoModal";
import Modal from "react-modal";
import GameActionButton from "./GameActionButton";
import { GameSoundContext } from "../../../../context/GameSoundContext";
Modal.setAppElement("#root");

const GameBar = ({ turn, leaveGame, offerDraw, botLevel, gameId, color }) => {
  const [isGameOptionsModalOpen, setIsGameOptionsModalOpen] = useState(false);
  const { selectSound, isMuted } = useContext(GameSoundContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const html = document.querySelector("html");
    if (!("DarkMode" in localStorage)) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
        setDarkMode(true);
      } else {
        html.classList.remove("dark");
        setDarkMode(false);
      }
    } else {
      if (localStorage.getItem("DarkMode") === "true") {
        html.classList.add("dark");
        setDarkMode(true);
      } else {
        html.classList.remove("dark");
        setDarkMode(false);
      }
    }
  }, []);
  const handleToggle = () => {
    const html = document.querySelector("html");
    if (!isMuted) selectSound.play();
    if (darkMode) {
      html.classList.remove("dark");
      localStorage.setItem("DarkMode", "false");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("DarkMode", "true");
      setDarkMode(true);
    }
  };
  return (
    <div>
      <div className="flex flex-row items-center px-2 py-2 bg-transparent">
        <div className="flex flex-row items-center space-x-1 ">
          {/* turn indicator */}
          <p
            className="px-2 py-1 font-medium text-black capitalize bg-yellow-300 rounded-full "
            data-title="TURN INDICATOR"
            data-intro="here you can see the whose turn it is"
          >
            {color && (turn === color ? "your turn" : "opponent's turn")}
            {!color && `${turn} player's turn`}
          </p>
          {/* dark mode toggle */}
          <div
            className="relative flex items-center justify-end mx-auto space-x-2"
            data-title="dark mode"
            data-intro="click on the toggle to change the theme"
          >
            <span className="text-xs font-semibold">Light </span>
            <div>
              <input
                type="checkbox"
                name=""
                id="checkbox"
                className="hidden"
                checked={darkMode}
                onClick={handleToggle}
              />
              <label for="checkbox" className="cursor-pointer">
                <div className="flex items-center h-5 bg-gray-300 rounded-full w-9 p2">
                  <div className="w-4 h-4 bg-white rounded-full shadow switch-ball"></div>
                </div>
              </label>
            </div>
            <span className="text-xs font-semibold">Dark</span>
          </div>
        </div>
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
          color={color}
        />
      </SmallScreenInfoModal>
    </div>
  );
};

export default GameBar;
