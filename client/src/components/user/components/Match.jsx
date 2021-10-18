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

  const textStyle = {
    borderColor: "#403750",
    textShadow:
      "-5px 1px #403750, -1px -1px 0 #403750, 1px -1px 0 #403750, -1px 1px 0 #403750, 1px 1px 0 #403750",
  };

  return (
    <div className="p-2 space-y-2 bg-yellow-300 rounded shadow-lg shadow-xl dark:bg-gray-600">
      <div className="flex flex-col items-center justify-around space-y-5 ">
        <div className="relative flex items-center justify-between w-full p-2 bg-yellow-100 rounded-lg shadow-xl dark:bg-gray-500">
          {self &&
            (self.ratingChange > 0 ? (
              <>
                <h1 className="text-xl font-bold tracking-tight text-green-500 ">
                  +{self.ratingChange}
                </h1>
                <h1
                  className="absolute text-3xl font-bold tracking-tight text-green-500 uppercase transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
                  style={textStyle}
                >
                  won
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold tracking-tight text-red-500">
                  {self.ratingChange}
                </h1>
                <h1
                  className="absolute text-2xl font-bold tracking-tight text-red-500 uppercase transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
                  style={textStyle}
                >
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
        <div className="flex flex-col items-center justify-around w-full sm:flex-row">
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
          <h1
            className="text-6xl font-bold tracking-tight text-white"
            style={textStyle}
          >
            vs
          </h1>
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
