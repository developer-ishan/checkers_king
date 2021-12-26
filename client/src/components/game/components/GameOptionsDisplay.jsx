import React from "react";

const GameOptionsDisplay = ({ gameOptions }) => {
  return (
    <div className="w-full p-4 pt-0 text-gray-800 bg-gray-100 divide-y divide-gray-400 dark:bg-gray-700 dark:text-white">
      <div className="flex flex-col ">
        {/* select checker */}
        <div className="py-4 flex flex-row justify-between">
          <h2 className="mb-2 font-bold capitalize ">Color : </h2>
          <div>{gameOptions.checker}</div>
        </div>
      </div>
      {/* force jump */}
      <div className="flex flex-row justify-between py-4">
        <h2 className="font-bold flex capitalize">mandatory moves : </h2>
        <div>{gameOptions.forceJump ? "On" : "OFF"}</div>
      </div>
      {/* is rated field */}
      <div className="py-4 flex flex-row justify-between ">
        <h2 className="my-2 font-bold capitalize">match type : </h2>

        <div>{gameOptions.isRated ? "Rated" : "Friendly"}</div>
       
      </div>
    </div>
  );
};
export default GameOptionsDisplay;
