import React from "react";
import PlayWithFriends from "./PlayWithFriends";
import RandomPlay from "./RandomPlay";

const UserAction = ({ socket }) => {
  return (
    <>
      <RandomPlay socket={socket} />
      <PlayWithFriends socket={socket} />
    </>
  );
};

export default UserAction;
