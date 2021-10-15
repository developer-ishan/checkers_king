import React, { useState } from "react";
import Modal from "react-modal";
import GameOptionsModal from "../../modal/GameOptionsModal";
import { useHistory } from "react-router-dom";
Modal.setAppElement("#root");

const RandomPlay = ({ socket }) => {
  const history = useHistory();
  const [isGameOptionModalOpen, setIsGameOptionModalOpen] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    checker: "red",
    bot: false,
    forceJump: true,
    gameName: "",
  });

  const handleStartGame = () => {
    const { gameName, bot } = gameOptions;
    socket.emit("create-game", gameName, bot);
    history.push("/game");
  };

  return (
    <div className="flex min-w-screen">
      <div className="relative flex flex-col items-center w-full max-w-6xl px-4 py-8 text-center rounded-lg shadow-2xl lg:text-left lg:block bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-400 sm:px-6 md:pb-0 md:pt-12 lg:px-12 lg:py-12">
        <p className="mt-1 text-sm font-medium text-indigo-200 uppercase xl:text-base xl:tracking-wider lg:mb-0">
          Show you moves!
        </p>
        <h2 className="my-2 text-xl font-extrabold tracking-tight text-white capitalize sm:my-4 md:text-3xl sm:text-4xl lg:my-0 xl:text-4xl sm:leading-tight">
          it's time for <br className="hidden md:block" />
          <span className="block text-indigo-200 xl:inline">
            a tea house party
          </span>
        </h2>

        <div className="flex mt-3 lg:mt-6 ">
          <div className="inline-flex">
            <a
              href="#"
              onClick={() => setIsGameOptionModalOpen(true)}
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-700 transition duration-150 ease-in-out bg-indigo-100 border border-transparent rounded-md hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline focus:border-indigo-300"
            >
              Play Now
            </a>
          </div>
        </div>
        <div className="bottom-0 right-0 hidden mb-0 mr-3 xl:block lg:absolute lg:-mb-12">
          <img
            alt="people playing games"
            src="https://cdn.devdojo.com/images/september2020/cta-1.png"
            className="max-w-xs mb-4 opacity-75 md:max-w-2xl lg:max-w-lg xl:mb-0 xl:max-w-md"
          />
        </div>
      </div>
      <GameOptionsModal
        modalState={isGameOptionModalOpen}
        setModalState={setIsGameOptionModalOpen}
        gameOptions={gameOptions}
        setGameOptions={setGameOptions}
        handleStartGame={handleStartGame}
      />
    </div>
  );
};

export default RandomPlay;
