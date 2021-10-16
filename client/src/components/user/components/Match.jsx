import React from "react";
import { Link } from "react-router-dom";

const Match = ({ matchId, players }) => {
  return (
    <div className="flex flex-col justify-around p-2 space-y-2 bg-white rounded shadow-lg sm:flex-row">
      <div className="flex flex-col items-center justify-around space-x-2 sm:flex-row">
        <p className="text-xs italic font-bold sm:text-sm">opponent:</p>
        <h1 className="text-sm font-bold sm:text-xl">{players[0].userName}</h1>
      </div>
      <Link
        to={`/replay/${matchId}`}
        className="w-full max-w-sm p-2 font-medium text-white bg-indigo-500 rounded shadow hover:bg-purple-700"
      >
        watch replay
      </Link>
    </div>
  );
};

export default Match;
