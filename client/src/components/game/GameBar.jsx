import React from "react";

const GameBar = ({ turn, leaveGame, offerDraw }) => {
  console.log(turn === "Red");
  return (
    <div className="grid w-full grid-cols-12 p-3 bg-indigo-400">
      <div
        id="gameRelatedInfo"
        className="flex justify-between col-span-12 space-x-2 sm:col-span-4 sm:col-start-10"
      >
        {/* turn indicator */}
        <div className="flex items-center space-x-2">
          {turn === "Red" ? (
            <div className="w-6 h-6 bg-red-500 border-4 border-white "></div>
          ) : (
            <div className="box-border w-5 h-5 bg-red-500 "></div>
          )}
          {turn === "Black" ? (
            <div className="w-6 h-6 bg-gray-900 border-4 border-white "></div>
          ) : (
            <div className="box-border w-5 h-5 bg-gray-900 "></div>
          )}
        </div>
        {/* offer draw button */}
        <button
          className="w-full max-w-xs px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-yellow-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-yellow-600 focus:outline-none ease"
          onClick={() => offerDraw()}
        >
          offer draw
        </button>
        {/* leave btn*/}
        <button
          className="w-full max-w-xs px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-red-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-red-600 focus:outline-none ease"
          onClick={() => leaveGame()}
        >
          leave
        </button>
      </div>
      {/* audio controls */}
      {/* maybe count of kitni goti kati */}
    </div>
  );
};

export default GameBar;
