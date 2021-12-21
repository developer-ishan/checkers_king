import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Match = ({ matchId, players, userId }) => {
  const [self, setSelf] = useState(null);
  const [opponent, setOpponent] = useState(null);

  useEffect(() => {
    const selfId = userId;
    let selfUserIndex = null;
    players.forEach((player, index) => {
      if (!selfUserIndex && player.id === selfId) {
        selfUserIndex = index;
        return;
      }
    });
    setSelf(players[selfUserIndex]);
    if (players.length > 1) setOpponent(players[1 - selfUserIndex]);
    else
      setOpponent({
        photo: "/images/bot.png",
        userName: "bot",
      });
  }, []);

  const textStyle = {
    borderColor: "#403750",
    textShadow:
      "-5px 1px #403750, -1px -1px 0 #403750, 1px -1px 0 #403750, -1px 1px 0 #403750, 1px 1px 0 #403750",
  };

  return (
    <div className="p-2 space-y-2 bg-yellow-300 rounded shadow-xl dark:bg-gray-600">
      <div className="flex flex-col items-center justify-around space-y-5 ">
        <div className="relative flex items-center justify-between w-full p-2 bg-yellow-100 rounded-lg shadow-xl dark:bg-gray-500">
          {self &&
            (self.ratingChange > 0 ? (
              <>
                <h1 className="text-xl font-bold tracking-tight text-green-500 ">
                  +{self.ratingChange}
                </h1>
                <h1
                  className="absolute text-xl font-bold tracking-tight text-green-500 uppercase transform md:text-3xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
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
                  className="absolute text-xl font-bold tracking-tight text-red-500 uppercase transform md:text-3xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
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
        <div className="flex flex-row items-center justify-around w-full">
          {self && (
            <div className="flex flex-col items-center flex-grow max-w-sm">
              <img
                src={self.photo}
                alt="player profile"
                className="w-10 h-10 rounded-full sm:w-16 sm:h-16 md:w-32 md:h-32 lg:w-40 lg:h-40"
              />
              <Link to={`/user/${self.id}`} className="hover:text-blue-500">
                {self.userName}
              </Link>
            </div>
          )}
          <h1
            className="flex-shrink-0 text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            style={textStyle}
          >
            vs
          </h1>
          {opponent && (
            <div className="flex flex-col items-center flex-grow max-w-sm">
              <img
                src={opponent.photo}
                alt="player profile"
                className="w-10 h-10 rounded-full sm:w-16 sm:h-16 md:w-32 md:h-32 lg:w-40 lg:h-40"
              />
              <Link to={`/user/${opponent.id}`} className="hover:text-blue-500">
                {opponent.userName}
              </Link>
            </div>
          )}
        </div>
      </div>
      <Link
        to={`/replay/${matchId}`}
        className="block w-full p-2 mx-auto font-medium text-center text-white bg-indigo-500 rounded shadow md:hidden hover:bg-purple-700"
      >
        watch replay
      </Link>
    </div>
  );
};

export default Match;
