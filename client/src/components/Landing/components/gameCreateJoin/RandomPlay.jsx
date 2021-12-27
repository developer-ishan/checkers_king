import React, { useState } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { getUserIdentification } from "../../../../helper/authHelper";
import GameButton from "../others/GameButton";
import RandomGameOptionsModal from "../../../modal/RandomGameOptionsModal";
import Cookies from "js-cookie";

Modal.setAppElement("#root");

const RandomPlay = ({ socket }) => {
  const history = useHistory();
  const [isGameOptionModalOpen, setIsGameOptionModalOpen] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    checker: "Red",
    bot: false,
    botLevel: 2,
    forceJump: true,
  });
  const handleStartGame = () => {
    const token = getUserIdentification();
    const { bot, botLevel, checker, forceJump } = gameOptions;
    if (bot)
      socket.emit(
        "create-game",
        bot,
        botLevel,
        checker,
        forceJump,
        false, // isRated field is false for bot by default
        token
      );
    else if (token) socket.emit("random-play-user", forceJump, token);
    else {
      const guestId = Cookies.get("guestId");
      socket.emit("random-play-guest", guestId, forceJump);
    }
    history.push("/game");
  };

  return (
    <div className="flex min-w-screen">
      <div className="relative flex flex-col items-center w-full max-w-6xl px-4 py-8 space-y-3 text-center rounded-lg shadow-2xl md:text-left md:block indigo-gradient dark:dark-gradient sm:px-6 md:px-12 md:py-12">
        <p className="mt-1 text-sm font-medium text-indigo-200 uppercase xl:text-base xl:tracking-wider lg:mb-0">
          Show you moves!
        </p>
        <h2 className="my-2 text-xl font-extrabold tracking-tight text-white capitalize font-custom sm:my-4 md:text-3xl sm:text-4xl lg:my-0 xl:text-4xl sm:leading-tight">
          it's time for <br className="hidden md:block" />
          <span className="block text-indigo-200 xl:inline">
            a tea house party
          </span>
        </h2>
        <span
          data-title="play now!"
          data-intro="in this section you can play with bot or with an online player"
          className="inline-block"
        >
          <GameButton
            className="p-2 font-bold text-indigo-500 bg-white"
            onClickFn={() => {
              setIsGameOptionModalOpen(true);
            }}
            shadowColor="#FBC638"
          >
            Play Now
          </GameButton>
        </span>

        <div className="absolute top-0 bottom-0 right-0 hidden transform scale-125 -rotate-12 md:block ">
          <img
            alt="people playing games"
            src="/images/gamepad.svg"
            className="h-full max-w-xs opacity-75 animate-floating"
          />
        </div>
      </div>
      <RandomGameOptionsModal
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
