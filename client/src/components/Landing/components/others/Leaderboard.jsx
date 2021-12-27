import React, { useEffect, useState } from "react";
import { getLeaderBoard } from "../../../../helper/userHelper";
import LeaderBoardListItem from "./LeaderBoardListItem";

const Leaderboard = () => {
  const [leaderBoardData, setLeaderBoardData] = useState(null);
  useEffect(() => {
    getLeaderBoard(1, 4).then((res) => {
      if (res) setLeaderBoardData([...res.data]);
    });
  }, []);
  const listLeaderboard = () => {
    return leaderBoardData.map((user) => <LeaderBoardListItem user={user} />);
  };
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
        {!leaderBoardData ? (
          <p className="text-center">loading...</p>
        ) : leaderBoardData.length === 0 ? (
          <p>
            <img
              src="https://img.icons8.com/ios-filled/50/000000/loading.png"
              className="w-3 h-3 mr-2 animate-spin"
            />
            no body on the leaderboard
          </p>
        ) : (
          listLeaderboard()
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
