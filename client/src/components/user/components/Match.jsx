import React from "react";

const Match = ({ live }) => {
  return (
    <div className="flex flex-col justify-around p-2 space-y-2 bg-white rounded shadow-lg sm:flex-row">
      <div className="flex flex-col items-center justify-around space-x-2 sm:flex-row">
        <p className="text-xs italic font-bold sm:text-sm">opponent:</p>
        <h1 className="text-sm font-bold sm:text-xl">janidushman</h1>
      </div>
      {live ? (
        <button
          type="submit"
          className="w-full max-w-sm p-2 font-medium text-white bg-indigo-500 rounded shadow hover:bg-purple-700"
        >
          ongoing
        </button>
      ) : (
        <button
          type="submit"
          className="w-full max-w-sm p-2 font-medium text-white bg-indigo-500 rounded shadow hover:bg-purple-700"
        >
          watch replay
        </button>
      )}
    </div>
  );
};

export default Match;
