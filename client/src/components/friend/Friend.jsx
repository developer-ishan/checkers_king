import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";
import AutoCompleteInput from "../comm/AutoCompleteInput";
import SendRequest from "./components/SendRequest";
const Friend = ({ userId }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [selected, setSelected] = useState({});
  useEffect(() => {
    socket.on("got-friend-request", ({userId, username, photo})=>{
      alert(`${username} sent friend request`);
    })
  }, [])
  return (
    <div>
      <h1>Friend section</h1>
      <div>
        <h1>Search User</h1>
        <AutoCompleteInput
          url="http://localhost:9500/api/user/search?q="
          selected={selected}
          setSelected={setSelected}
        />
        <div>{selected._id ? <SendRequest user={selected} /> : ""}</div>
      </div>
    </div>
  );
};

export default Friend;
