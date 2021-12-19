import React from "react";

const Leaderboard = () => {
  return (
    <div
      data-title="leaderboard"
      data-intro="this board show the top players of the game"
    >
      <div className="flex justify-center max-w-sm ">
        <div className="flex flex-col items-start justify-between w-4/5 h-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex flex-row  justify-center items-center w-full p-4 pb-0 pb-3 bg-pink-500 dark:bg-gray-800">
            <h2 className="text-center text-lg text-white font-semibold tracking-wide">
              Leaderboard
            </h2>
            <img
              className="w-8 h-8 ml-1"
              src="https://img.icons8.com/external-wanicon-flat-wanicon/64/000000/external-medal-st-patrick-day-wanicon-flat-wanicon.png"
            />
          </div>
          <div className="w-full p-4 pt-0 text-gray-800 dark:text-white dark-gray-300 dark:bg-gray-700 divide-y divide-gray-400">
            <div
              className="flex flex-row items-center justify-between py-4"
              data-title="players info"
              data-intro="you can click on the name to see more info"
            >
              <img
                src="/images/default.png"
                alt="user-1"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-sm">
                <span className="block font-semibold">Deltondo Matthew</span>
                <span className="block text-xs font-light text-gray-700 dark:text-white">
                  Internation grand master
                </span>
              </div>
              <a
                href="#"
                className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
              >
                3200
              </a>
            </div>
            <div className="flex flex-row items-center justify-between py-4">
              <img
                src="/images/default.png"
                alt="user-1"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-sm">
                <span className="block font-semibold">Adriana Cardoson</span>
                <span className="block text-xs font-light text-gray-700 dark:text-white">
                  grand master
                </span>
              </div>
              <a
                href="#"
                className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
              >
                2500
              </a>
            </div>
            <div className="flex flex-row items-center justify-between pt-4">
              <img
                src="/images/default.png"
                alt="user-1"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-sm">
                <span className="block font-semibold">Daniela Moreauno</span>
                <span className="block text-xs font-light text-gray-700 dark:text-white">
                  diamond
                </span>
              </div>
              <a
                href="#"
                className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
              >
                2000
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
