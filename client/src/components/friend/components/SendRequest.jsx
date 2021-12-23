import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { isAuthenticated } from "../../../helper/authHelper";
import { SocketContext } from "../../../context/SocketContext";

const SendRequest = ({ user }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [userState, setUserState] = useContext(UserContext);
  return (
      <div>
        <h1>{user.username}</h1>
        <button onClick={(e) => {
          const token = isAuthenticated();
          if(token)
            socket.emit("send-friend-request", {
            token: token,
            receiverId: user._id,
            text: "Hi there accept my request! (default)"
          })
        }}>
          Send
        </button>
      </div>
  )
};

export default SendRequest;
