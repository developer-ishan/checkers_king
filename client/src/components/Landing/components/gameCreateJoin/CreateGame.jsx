import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { getUserIdentification } from "../../../../helper/authHelper";
import GameButton from "../others/GameButton";
import PlayWithFriendsOptionsModal from "../../../modal/PlayWithFriendsOptionsModal";
import { GameSoundContext } from "../../../../context/GameSoundContext";
const CreateGame = ({ socket }) => {
  let history = useHistory();
  const { clickSound, isMuted } = useContext(GameSoundContext);
  const [isGameOptionModalOpen, setIsGameOptionModalOpen] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    checker: "Red",
    forceJump: true,
    isRated: true,
  });

  const handleCreateGame = () => {
    if (!isMuted) clickSound.play();
    const token = getUserIdentification();
    const { checker, forceJump, isRated } = gameOptions;
    // ARGS :- ("create-game" ,isBot, botLevel, color, mandatoryMoves, isRated, token)
    socket.emit("create-game", false, -1, checker, forceJump, isRated, token);
    history.push("/game");
  };

  return (
    <div className="relative grid w-full h-64 bg-white sm:h-full sm:rounded-lg sm:shadow-xl place-content-center">
      <img
        src="/images/flame-vr-game.png"
        className="absolute transform inset-x-2/4 inset-y-2/4 -translate-x-2/4 -translate-y-2/4"
        alt="game image"
      />
      <div className="absolute inset-0 rounded opacity-70 indigo-gradient dark:dark-gradient dark:bg-opacity-100 "></div>
      <GameButton
        className="absolute p-2 font-bold text-indigo-500 transform bg-white top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
        onClickFn={() => setIsGameOptionModalOpen(true)}
      >
        New Game
      </GameButton>
      <PlayWithFriendsOptionsModal
        modalState={isGameOptionModalOpen}
        setModalState={setIsGameOptionModalOpen}
        gameOptions={gameOptions}
        setGameOptions={setGameOptions}
        handleCreateGame={handleCreateGame}
      />
    </div>
  );
};

export default CreateGame;
