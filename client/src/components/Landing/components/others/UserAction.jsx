import React from "react";
import PlayWithFriends from "../gameCreateJoin/PlayWithFriends";
import RandomPlay from "../gameCreateJoin/RandomPlay";

const UserAction = ({ socket }) => {
  return (
    <>
      <RandomPlay socket={socket} />
      <PlayWithFriends socket={socket} />
    </>
  );
};

export default UserAction;
