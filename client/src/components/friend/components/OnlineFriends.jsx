import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { SocketContext } from "../../../context/SocketContext";
import InviteButton from "./InviteButton";

const RequestList = ({ heading }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [userState, setUserState] = useContext(UserContext);
  const [friends, setFriends] = useState([]);

  const handleDistinctMerge = (oArr1, oArr2) => {
    for (let i = 0; i < oArr2.length; ++i) {
      let found = false;
      for (let j = 0; j < oArr1.length && !found; ++j) {
        if (oArr1[i].userId === oArr2[j].userId) found = true;
      }
      if (!found) oArr1.push(oArr2[i]);
    }
    return oArr1;
  };

  const findOnlineFriendWithId = (oldFriendState, userId) => {
    return oldFriendState.find((friend) => friend.userId === userId);
  };

  useEffect(() => {
    socket.on("friend-online", (onlineFriends) => {
      console.log("friend came online...", friends);
      setFriends((oldFriendState) =>
        handleDistinctMerge(oldFriendState, onlineFriends)
      );
    });

    socket.on("friend-offline", (offlineFriend) => {
      console.log("offline-friend caught...", offlineFriend);
      if (offlineFriend) {
        setFriends((fs) => {
          return fs.filter((f) => f.userId !== offlineFriend.userId);
        });
      }
    });

    socket.on("user-status", (userStatus) => {
      console.log("user-status caught");
      console.log(userStatus);
      if (userStatus)
        setFriends((fs) => {
          return fs.map((f) => {
            if (f.userId === userStatus.id)
              return { ...f, status: userStatus.status };
            else return f;
          });
        });
    });

    return () => {
      socket.off("friend-online");
      socket.off("friend-offline");
      socket.off("user-status");
    };
  }, [socket]);

  return (
    <div
      data-title="ONLINE FRIENDS"
      data-intro="list of people who are online, you can invite them for game or can watch their game"
      className="flex-grow w-full bg-white rounded-lg shadow-xl dark:bg-gray-700 lg:mx-auto lg:w-10/12"
    >
      <div className="p-4 bg-pink-500 rounded-t-lg dark:bg-gray-800">
        <h2 className="text-lg font-semibold tracking-wide text-center text-white capitalize">
          online friends
        </h2>
      </div>
      <div className="p-4 pt-0 text-gray-800 divide-y divide-gray-400 rounded-b-lg dark:text-white ">
        {friends.map((f) => (
          <div
            className="flex flex-row items-center justify-between py-4"
            data-title="players info"
            data-intro="you can click on the name to see more info"
          >
            <img
              src={f.photo}
              alt="user-1"
              className="w-12 h-12 rounded-full"
            />
            <div className="text-sm">
              <span className="block font-semibold">{f.username}</span>
            </div>
            {/* IDLE IN_GAME IN_LOBBY */}
            {f.status === "IDLE" ? (
              <InviteButton friend={f} />
            ) : (
              <p>{f.status}</p>
            )}
          </div>
        ))}
        {friends.length === 0 && (
          <div className="text-center capitalize">
            <p className="p-2 text-sm font-bold dark:text-white">
              no friend online
            </p>
            <img
              src="/images/alone-cat.png"
              alt=""
              className="w-full max-w-xs mx-auto"
            />
            <p className="p-2 text-sm font-bold dark:text-white">
              looks like everyone is busy today
            </p>
            <p className="p-2 text-sm font-bold dark:text-white">
              you can still play with random oniline players
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;
