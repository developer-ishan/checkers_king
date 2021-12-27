import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";
import { isAuthenticated } from "../../helper/authHelper";
import AutoCompleteInput from "../comm/AutoCompleteInput";
import SendRequest from "./components/SendRequest";
const Friend = ({ userId }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [selected, setSelected] = useState({});
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    // socket.on("got-friend-request", ({ userId, username, photo }) => {
    //   alert(`${username} sent friend request`);
    //   setRequests((old) => [...old, { userId, username, photo }]);
    // });
    // socket.on("ack-friend-request", ({ userId, username, photo, response }) => {
    //   if (response) alert(`${username} accepted friend request`);
    //   else alert(`${username} rejected friend request`);
    // });
    return () => {
      // socket.off("got-friend-request");
      // socket.off("ack-friend-request");
    };
  }, [requests]);
  return (
    <div>
      <h1>Friend section</h1>
      <div>
        <h1>Search User</h1>
        <AutoCompleteInput
          url="http://localhost:9500/api/user/search_not_friends?q="
          headers={{ Authorization: `Bearer ${isAuthenticated()}` }}
          selected={selected}
          setSelected={setSelected}
        />
        <div>{selected._id ? <SendRequest user={selected} /> : ""}</div>
      </div>
      <div>
        <h1>My Requests</h1>
        <div>
          {requests.map((request) => {
            return (
              <div>
                <span>{request.username}</span>
                <button
                  onClick={() => {
                    socket.emit(
                      "respond-friend-request",
                      {
                        token: isAuthenticated(),
                        senderId: request.userId,
                        response: true,
                      },
                      (resp) => {
                        alert(resp.msg);
                      }
                    );
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    socket.emit(
                      "respond-friend-request",
                      {
                        token: isAuthenticated(),
                        senderId: request.userId,
                        response: false,
                      },
                      (resp) => {
                        alert(resp.msg);
                      }
                    );
                  }}
                >
                  Reject
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Friend;
