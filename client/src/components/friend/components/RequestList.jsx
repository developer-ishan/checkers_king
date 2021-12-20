import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { SocketContext } from "../../context/SocketContext";

const RequestList = ({ heading }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [userState, setUserState] = useContext(UserContext);
  return (
      <div></div>
  )
};

export default RequestList;
