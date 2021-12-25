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
    return () => {
      socket.off("friend-online");
    };
  }, []);
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
              src="/images/default.png"
              alt="user-1"
              className="w-12 h-12 rounded-full"
            />
            <div className="text-sm">
              <span className="block font-semibold">{f.username}</span>
              <span className="block text-xs font-light text-gray-700 dark:text-white">
                Internation grand master
              </span>
            </div>
            <a
              href="#"
              className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
            >
              invite
            </a>
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
              className="w-full max-w-sm mx-auto"
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
