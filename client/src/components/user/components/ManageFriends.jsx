import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import SmallScreenInfoModal from "../../modal/SmallScreenInfoModal";

const ManageFriends = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userState, setUserState] = useContext(UserContext);
  const [receivedRequests, setReceivedRequests] = useState([]);
  useEffect(() => {}, [userState]);
  return (
    <>
      <div>
        <button
          type="button"
          className="w-full px-4 py-2 mt-2 font-bold text-white capitalize bg-indigo-700 rounded hover:bg-indigo-800"
          onClick={() => setIsModalOpen(true)}
        >
          Manage friends
        </button>
      </div>
      <SmallScreenInfoModal
        setModalState={setIsModalOpen}
        modalState={isModalOpen}
        title="manage Friends"
      >
        <div style={{ maxHeight: "60vh" }} className="overflow-y-auto ">
          <div>
            <p className="w-full p-1 text-sm font-bold capitalize bg-gray-400">
              received Requests
            </p>
            <div>{`you have 0 friend requests`}</div>
          </div>
          <div>
            <p className="w-full p-1 text-sm font-bold capitalize bg-gray-400">
              sent Requests
            </p>
            <div>{`you have 0 sent friend requests`}</div>
          </div>

          <div>
            <p className="w-full p-1 text-sm font-bold capitalize bg-gray-400">
              friends
            </p>
            <div>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
              <p>james bond</p>
            </div>
          </div>
        </div>
      </SmallScreenInfoModal>
    </>
  );
};

export default ManageFriends;

/*
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
                  <span className="block font-semibold">Deltondo Matthew</span>
                  <span className="block text-xs font-light text-gray-700 dark:text-white">
                    Internation grand master
                  </span>
                </div>
                <div className="flex flex-col">
                  <a
                    href="#"
                    className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
                  >
                    accept
                  </a>
                  <a
                    href="#"
                    className="self-start block px-2 py-px mt-1 text-xs font-semibold tracking-wide uppercase border border-gray-400 rounded-full hover:bg-indigo-400 hover:text-white hover:border-transparent"
                  >
                    reject
                  </a>
                </div>
              </div>
              */
