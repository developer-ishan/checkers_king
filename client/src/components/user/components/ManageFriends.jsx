import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import {
  getAllFriendRequestsToUser,
  getAllFriendsOfUser,
  getAllSentRequestByUser,
} from "../../../helper/userHelper";
import SmallScreenInfoModal from "../../modal/SmallScreenInfoModal";
import ListUserItem from "./ListUserItem";

const ManageFriends = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userState, setUserState] = useContext(UserContext);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, [userState]);

  const handleModal = () => {
    setIsModalOpen(true);
    setLoading(true);
    getAllFriendRequestsToUser().then((res) => {
      console.log("friendship request:", res);
      setReceivedRequests(res);
    });
    getAllFriendsOfUser().then((res) => {
      console.log("friends:", res);
      setFriends(res);
    });
    getAllSentRequestByUser().then((res) => {
      console.log("send request", res);
      setFriends((old) => [...res, ...old]);
    });
    setLoading(false);
  };

  const listReceivedRequests = () => {
    return receivedRequests.map((request) => <ListUserItem data={request} />);
  };
  const listFriends = () => {
    return friends.map((friend) => <ListUserItem data={friend} />);
  };
  return (
    <>
      <div>
        <button
          type="button"
          className="w-full px-4 py-2 mt-2 font-bold text-white capitalize bg-indigo-700 rounded hover:bg-indigo-800"
          onClick={() => handleModal()}
        >
          Manage friends
        </button>
      </div>
      <SmallScreenInfoModal
        setModalState={setIsModalOpen}
        modalState={isModalOpen}
        title="manage Friends"
      >
        {loading ? (
          <p className="p-1 text-center">loading..</p>
        ) : (
          <div
            style={{ maxHeight: "60vh" }}
            className="overflow-y-auto bg-gray-100 dark:bg-gray-700"
          >
            <div>
              <p className="w-full p-1 text-sm font-bold capitalize bg-indigo-400 dark:bg-gray-400">
                received Requests
              </p>

              {receivedRequests.length > 0 ? (
                listReceivedRequests()
              ) : (
                <p className="py-1 text-center">you have no pending requests</p>
              )}
            </div>

            <div>
              <p className="w-full p-1 text-sm font-bold capitalize bg-indigo-400 dark:bg-gray-400">
                friends
              </p>
              <div>
                {friends.length > 0 ? (
                  listFriends()
                ) : (
                  <>
                    <p className="py-1 text-center">
                      you have not made any friend yet
                    </p>
                    <img
                      src="/images/friends.png"
                      alt="friends partying together"
                      className="w-3/4 max-w-sm mx-auto"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </SmallScreenInfoModal>
    </>
  );
};

export default ManageFriends;
