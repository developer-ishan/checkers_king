import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { SocketContext } from "../../../context/SocketContext";

const RequestList = ({ heading }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    socket.on("friend-online", (friends) => {
      setFriends((old) => {
        return [...old, ...friends];
      });
    });
    socket.on("friend-offline", (friend) => {
      setFriends((old) => {
        const i = friends.indexOf(friend);
        return [...old.slice(0, i), old.slice(i + 1)];
      });
    });
    return () => {
      socket.off("friend-online");
      socket.off("friend-offline");
    };
  }, []);
  return (
    <div>
      <h1>Online Friends</h1>
      <ul>
        {friends.map((f) => (
          <li>{f.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default RequestList;
