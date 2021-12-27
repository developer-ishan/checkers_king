import React, { useEffect, useState } from "react";
import {
  getUserIdentification,
  isAuthenticated,
} from "../../../helper/authHelper";
import { getFriendShipStatus } from "../../../helper/userHelper";
import SendRequest from "../../friend/components/SendRequest";
import ManageRequest from "./ManageRequest";

const FriendshipButton = ({ userId, userName }) => {
  const [friendship, setFriendship] = useState({ status: "ADD FRIEND" });
  useEffect(() => {
    if (userId && isAuthenticated())
      getFriendShipStatus(userId)
        .then((res) => {
          console.log("friendship status ;", res);
          setFriendship(res);
        })
        .catch((err) => {
          console.log("error occured in friendship status", err);
          alert("some error occured please try again after some time");
        });
  }, [userId]);
  useEffect(() => {
    console.log("remounted after status change");
  }, [friendship]);
  const renderBtn = () => {
    switch (friendship.status) {
      case "REQUESTED":
        return (
          <button
            type="button"
            className="w-full px-4 py-2 mt-2 font-bold text-white capitalize bg-indigo-700 rounded hover:bg-indigo-800"
          >
            requested
          </button>
        );
      case "PENDING":
        return (
          <ManageRequest
            msg={friendship.text}
            userId={userId}
            userName={userName}
            setStatus={setFriendship}
          />
        );
      case "FRIENDS":
        return (
          <button
            type="button"
            className="w-full px-4 py-2 mt-2 font-bold text-white capitalize bg-indigo-700 rounded hover:bg-indigo-800"
          >
            friends
          </button>
        );

      default:
        // the default is add friend button
        return <SendRequest userId={userId} setStatus={setFriendship} />;
    }
  };
  return <div>{renderBtn()}</div>;
};

export default FriendshipButton;
