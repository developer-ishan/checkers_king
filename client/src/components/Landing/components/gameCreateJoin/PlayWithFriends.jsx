import React from "react";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

const PlayWithFriends = ({ socket }) => {
  return (
    <div
      className="mt-4"
      data-title="its more fun with friends!"
      data-intro="you can also play the game with your friend online"
    >
      <h2 className="mt-3 font-bold capitalize text-md sm:text-2xl ">
        play with friends
      </h2>
      <div className="grid grid-cols-12 gap-2 mt-3">
        <div
          className="col-span-12 sm:col-span-6"
          data-title="join game"
          data-intro="ask your friend for the code, enter code and play"
        >
          <JoinGame socket={socket} />
        </div>
        <div
          className="col-span-12 sm:col-span-6"
          data-title="create game"
          data-intro="click on the button to create a game and share the code with your friend"
        >
          <CreateGame socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default PlayWithFriends;
