import React from "react";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

const PlayWithFriends = () => {
  return (
    <div>
      <h2 className="mt-3 text-2xl font-bold capitalize">play with friends</h2>
      <div className="grid grid-cols-12 gap-2 mt-3">
        <div className="col-span-12 sm:col-span-6">
          <JoinGame />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <CreateGame />
        </div>
      </div>
    </div>
  );
};

export default PlayWithFriends;
