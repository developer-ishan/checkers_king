import React, { useState } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");
const RandomPlay = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [gameOption, setGameOptions] = useState({
    checker: "red",
    bot: false,
    forceJump: true,
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleStartGame = () => {
    alert("ruko jara sabar kro ! kar rhe start");
  };

  return (
    <div className="flex min-w-screen">
      <div className="relative flex flex-col items-center w-full max-w-6xl px-4 py-8 text-center rounded-lg shadow-2xl lg:text-left lg:block bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-400 sm:px-6 md:pb-0 md:pt-12 lg:px-12 lg:py-12">
        <p className="mt-1 mb-10 text-sm font-medium text-indigo-200 uppercase xl:text-base xl:tracking-wider lg:mb-0">
          Show you moves!
        </p>
        <h2 className="my-4 text-3xl font-extrabold tracking-tight text-white capitalize sm:text-4xl md:text-5xl lg:my-0 xl:text-4xl sm:leading-tight">
          it's time for <br className="hidden md:block" />
          <span className="block text-indigo-200 xl:inline">
            a tea house party
          </span>
        </h2>

        <div className="flex mb-8 lg:mt-6 lg:mb-0">
          <div className="inline-flex">
            <a
              href="#"
              onClick={openModal}
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
      <Modal
        className="absolute w-2/5 transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
        isOpen={modalIsOpen}
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
                      checked={gameOption.checker === "red"}
                      onChange={() =>
                        setGameOptions({
                          ...gameOption,
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
                      checked={gameOption.checker === "blue"}
                      onChange={() =>
                        setGameOptions({
                          ...gameOption,
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
                    checked={gameOption.bot}
                    onChange={() => {
                      setGameOptions({ ...gameOption, bot: !gameOption.bot });
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
                    checked={gameOption.forceJump}
                    onChange={() => {
                      setGameOptions({
                        ...gameOption,
                        forceJump: !gameOption.forceJump,
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
    </div>
  );
};

export default RandomPlay;
