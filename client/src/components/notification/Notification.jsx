import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";

const Notification = ({ heading }) => {
  const [socket, setSocket] = useContext(SocketContext);
  return (
      <div></div>
  )
};

export default Notification;
