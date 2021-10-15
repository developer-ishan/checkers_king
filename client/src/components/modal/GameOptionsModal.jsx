import React from "react";
import Modal from "react-modal";

const gameOptionsModal = ({
  modalState,
  setModalState,
  gameOptions,
  setGameOptions,
  handleStartGame,
}) => {
  const closeModal = () => {
    setModalState(false);
  };
  return (
    <Modal
      className="absolute w-2/5 transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
      isOpen={modalState}
      onRequestClose={closeModal}
    >
      <div class="flex justify-center max-w-sm mx-auto">
        <div class="flex flex-col items-start justify-between w-4/5 h-auto my-20 overflow-hidden bg-white rounded-lg shadow-xl">
          <div class="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3">
            <h2 class="mr-auto text-lg font-semibold tracking-wide uppercase">
              options
            </h2>
            <div class="flex flex-row">
              <a
                href="#"
                class="text-xs text-blue-700 "
                onClick={() => closeModal()}
              >
                close
              </a>
            </div>
          </div>
          <div class="w-full p-4 pt-0 text-gray-800 bg-gray-100 divide-y divide-gray-400">
            {/* select checker */}
            <div class=" py-4">
              <h2 className="font-bold capitalize">checker</h2>

              <div className="flex items-center space-x-2">
                <label htmlFor="red" className="flex items-center">
                  <input
                    type="radio"
                    name="red"
                    id="red"
                    checked={gameOptions.checker === "red"}
                    onChange={() =>
                      setGameOptions({
                        ...gameOptions,
                        checker: "red",
                      })
                    }
                  />
                  <p>red</p>
                </label>
                <label htmlFor="blue" className="flex items-center">
                  <input
                    type="radio"
                    name="blue"
                    id="blue"
                    checked={gameOptions.checker === "blue"}
                    onChange={() =>
                      setGameOptions({
                        ...gameOptions,
                        checker: "blue",
                      })
                    }
                  />
                  <p>blue</p>
                </label>
              </div>
            </div>
            {/* play with bot */}
            <div class="flex flex-row items-center justify-between py-4">
              <h2 className="font-bold capitalize">play with bot</h2>
              <label htmlFor="playwithbot">
                <input
                  type="checkbox"
                  name="playwithbot"
                  id="playwithbot"
                  checked={gameOptions.bot}
                  onChange={() => {
                    setGameOptions({ ...gameOptions, bot: !gameOptions.bot });
                  }}
                />
              </label>
            </div>
            {/* force jump */}
            <div class="flex flex-row items-center justify-between pt-4">
              <h2 className="font-bold capitalize">forced jumps</h2>
              <label htmlFor="forcedjumps">
                <input
                  type="checkbox"
                  name="forcedjumps"
                  id="forcedjumps"
                  checked={gameOptions.forceJump}
                  onChange={() => {
                    setGameOptions({
                      ...gameOptions,
                      forceJump: !gameOptions.forceJump,
                    });
                  }}
                />
              </label>
            </div>
            {/* game name */}
            <div className="pt-4">
              <h2 className="font-bold capitalize">game name</h2>
              <label htmlFor="gamename">
                <input
                  type="text"
                  name="gamename"
                  id="gamename"
                  className="w-full rounded"
                  placeholder="name this game"
                  onChange={(e) => {
                    setGameOptions({
                      ...gameOptions,
                      gameName: e.target.value,
                    });
                  }}
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-4 text-white capitalize bg-indigo-500"
            onClick={() => handleStartGame()}
          >
            start game
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default gameOptionsModal;
