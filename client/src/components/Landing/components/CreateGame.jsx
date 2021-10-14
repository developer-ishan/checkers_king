import React from "react";

const CreateGame = () => {
  return (
    <div className="relative grid w-full h-64 bg-white sm:h-full sm:rounded-lg sm:shadow-xl place-content-center">
      <img
        src="/images/flame-vr-game.png"
        className="absolute transform inset-x-2/4 inset-y-2/4 -translate-x-2/4 -translate-y-2/4"
        alt="game image"
      />
      <div className="absolute rounded inset-1 opacity-70 bg-gradient-to-br from-purple-600 via-indigo-500 to-teal-400"></div>
      <div className="">
        <a
          href="#"
          className="block table p-2 p-4 mx-auto text-white capitalize transform border-4 border-dashed rounded-full hover:scale-150 active:scale-150 align place-content-center"
        >
          <img src="https://img.icons8.com/android/24/000000/plus.png" />
        </a>
        <p className="mt-3 font-bold text-white text-dark-900">
          create new game
        </p>
      </div>
    </div>
  );
};

export default CreateGame;
