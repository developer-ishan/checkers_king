import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Match = ({ matchId, players, userId }) => {
  const [self, setSelf] = useState(null);
  const [opponent, setOpponent] = useState(null);

  useEffect(() => {
    console.log("MOUNTED MATCH");
    const selfId = userId;
    let selfUserIndex = null;
    players.forEach((player, index) => {
      console.log("runnig at", index);
      if (!selfUserIndex && player.id === selfId) {
        console.log("found at", index);
        selfUserIndex = index;
        return;
      }
    });
    console.log("playersObject:", players);
    console.log("selfIndex:", selfUserIndex);
    setSelf(players[selfUserIndex]);
    setOpponent(players[1 - selfUserIndex]);
  }, []);

  return (
    <div className="p-2 space-y-2 bg-white rounded shadow-lg">
      <div className="flex flex-col items-center justify-around space-y-5 ">
        <div className="flex items-center justify-between w-full p-1 bg-gray-200">
          {self &&
            (self.ratingChange > 0 ? (
              <>
                <h1 className="font-bold tracking-tight text-green-500">
                  +{self.ratingChange}
                </h1>
                <h1 className="font-bold tracking-tight text-green-500 uppercase">
                  won
                </h1>
              </>
            ) : (
              <>
                <h1 className="font-bold tracking-tight text-red-500">
                  {self.ratingChange}
                </h1>
                <h1 className="font-bold tracking-tight text-red-500 uppercase">
                  loose
                </h1>
              </>
            ))}
          <Link
            to={`/replay/${matchId}`}
            className="hidden p-2 font-medium text-center text-white bg-indigo-500 rounded shadow md:block hover:bg-purple-700"
          >
            watch replay
          </Link>
        </div>
        <div className="flex items-center justify-around w-full">
          {self && (
            <div className="flex flex-col items-center">
              <img
                src={self.profileUrl}
                alt="player profile"
                className="w-3/4 h-3/4"
              />
              <Link to={`/user/${self.id}`} className="hover:text-blue-500">
                {self.userName}
              </Link>
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight">vs</h1>
          <div>
            {opponent && (
              <div className="flex flex-col items-center">
                <img
                  src={opponent.profileUrl}
                  alt="player profile"
                  className="w-3/4 h-3/4"
                />
                <Link
                  to={`/user/${opponent.id}`}
                  className="hover:text-blue-500"
                >
                  {opponent.userName}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Link
        to={`/replay/${matchId}`}
        className="block w-full max-w-sm p-2 mx-auto font-medium text-center text-white bg-indigo-500 rounded shadow md:hidden hover:bg-purple-700"
      >
        watch replay
      </Link>
    </div>
  );
};

export default Match;
