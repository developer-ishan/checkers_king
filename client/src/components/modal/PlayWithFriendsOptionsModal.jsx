import React, { useContext, useEffect } from "react";
import Modal from "react-modal";
import { GameSoundContext } from "../../context/GameSoundContext";

const PlayWithFriendsOptionsModal = ({
  modalState,
  setModalState,
  gameOptions,
  setGameOptions,
  handleCreateGame,
}) => {
  const { selectSound, isMuted } = useContext(GameSoundContext);
  const closeModal = () => {
    if (!isMuted) selectSound.play();
    setModalState(false);
  };
  const playOptionSelectSound = () => {
    if (!isMuted) selectSound.play();
  };
  return (
    <Modal
      className="absolute w-11/12 max-w-md transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
      isOpen={modalState}
      onRequestClose={closeModal}
    >
      <div className="flex justify-center mx-auto">
        <div className="flex flex-col items-start justify-between w-full h-auto my-20 overflow-hidden bg-white rounded-lg shadow-xl sm:w-4/5 dark:bg-gray-700">
          <div className="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3">
            <h2 className="mr-auto text-lg font-semibold tracking-wide uppercase">
              options
            </h2>
            <div className="flex flex-row">
              <a
                href="#"
                className="text-xs text-xl text-blue-700 hover:text-red-500 dark:text-pink-400 "
                onClick={() => closeModal()}
              >
                &#10006;
              </a>
            </div>
          </div>
          <div className="w-full p-4 pt-0 text-gray-800 bg-gray-100 divide-y divide-gray-400 dark:bg-gray-700 dark:text-white">
            <div className="flex flex-col ">
              {/* select checker */}
              <div className="py-4 ">
                <h2 className="mb-2 font-bold capitalize">choose color : </h2>
                <div className="flex items-center space-x-2">
                  <label htmlFor="red" className="flex items-center mx-1">
                    <input
                      type="radio"
                      name="red"
                      id="red"
                      checked={gameOptions.checker === "Red"}
                      onChange={() => {
                        playOptionSelectSound();
                        setGameOptions({
                          ...gameOptions,
                          checker: "Red",
                        });
                      }}
                    />
                    <p className="mx-2">Red</p>
                  </label>
                  <label htmlFor="black" className="flex items-center mx-1">
                    <input
                      type="radio"
                      name="black"
                      id="black"
                      checked={gameOptions.checker === "Black"}
                      onChange={() => {
                        playOptionSelectSound();
                        setGameOptions({
                          ...gameOptions,
                          checker: "Black",
                        });
                      }}
                    />
                    <p className="mx-2">Black</p>
                  </label>
                </div>
              </div>
            </div>
            {/* force jump */}
            <div className="flex flex-row items-center justify-between py-4">
              <h2 className="font-bold capitalize">mandatory moves : </h2>
              <label htmlFor="forcedjumps">
                <input
                  type="checkbox"
                  name="forcedjumps"
                  id="forcedjumps"
                  className="dark:text-pink-500"
                  checked={gameOptions.forceJump}
                  onChange={() => {
                    playOptionSelectSound();
                    setGameOptions({
                      ...gameOptions,
                      forceJump: !gameOptions.forceJump,
                    });
                  }}
                />
              </label>
            </div>
            {/* is rated field */}
            <div className="py-4 ">
              <h2 className="my-2 font-bold capitalize">match type : </h2>

              <div className="flex items-center space-x-2">
                <label htmlFor="rated" className="flex items-center mx-1">
                  <input
                    type="radio"
                    name="rated"
                    id="rated"
                    checked={gameOptions.isRated === true}
                    onChange={() => {
                      playOptionSelectSound();
                      setGameOptions({
                        ...gameOptions,
                        isRated: true,
                      });
                    }}
                  />
                  <p className="mx-2">Rated</p>
                </label>
                <label htmlFor="friendly" className="flex items-center mx-1">
                  <input
                    type="radio"
                    name="friendly"
                    id="friendly"
                    checked={gameOptions.isRated === false}
                    onChange={() => {
                      playOptionSelectSound();
                      setGameOptions({
                        ...gameOptions,
                        isRated: false,
                      });
                    }}
                  />
                  <p className="mx-2">Friendly</p>
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-4 text-white capitalize bg-indigo-500"
            onClick={() => handleCreateGame()}
          >
            create game
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PlayWithFriendsOptionsModal;
