import React from "react";

const Leaderboard = () => {
  return (
    <div
      data-title="leaderboard"
      data-intro="this board show the top players of the game"
      className="flex-grow w-full bg-white rounded-lg shadow-xl dark:bg-gray-700 lg:mx-auto lg:w-10/12"
    >
      <div className="flex flex-row items-center justify-center p-4 bg-pink-500 rounded-t-lg dark:bg-gray-800">
        <h2 className="text-lg font-semibold tracking-wide text-center text-white capitalize">
          Leaderboard
        </h2>
        <img
          className="w-8 h-8 ml-1"
          src="https://img.icons8.com/external-wanicon-flat-wanicon/64/000000/external-medal-st-patrick-day-wanicon-flat-wanicon.png"
        />
      </div>
      <div className="p-4 pt-0 text-gray-800 divide-y divide-gray-400 rounded-b-lg dark:text-white ">
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
  );
};

export default Leaderboard;
