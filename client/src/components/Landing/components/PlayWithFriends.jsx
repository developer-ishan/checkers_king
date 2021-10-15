import React from "react";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

const PlayWithFriends = ({ socket }) => {
  return (
    <div className="my-4">
      <h2 className="mt-3 font-bold capitalize text-md sm:text-2xl ">
        play with friends
      </h2>
      <div className="grid grid-cols-12 gap-2 mt-3">
        <div className="col-span-12 sm:col-span-6">
          <JoinGame socket={socket} />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <CreateGame socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default PlayWithFriends;
