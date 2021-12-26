import React, { useContext, useState } from "react";
import { SocketContext } from "../../../context/SocketContext";
import { isAuthenticated } from "../../../helper/authHelper";
import ConfirmModal from "../../modal/ConfirmModal";

const ManageRequest = ({ msg, userId, userName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socket, setSocket] = useContext(SocketContext);
  const acceptRequest = () => {
    socket.emit(
      "respond-friend-request",
      {
        token: isAuthenticated(),
        senderId: userId,
        response: true,
      },
      (resp) => {
        alert(resp.msg);
      }
    );
  };
  const rejectRequest = () => {
    socket.emit(
      "respond-friend-request",
      {
        token: isAuthenticated(),
        senderId: userId,
        response: false,
      },
      (resp) => {
        alert(resp.msg);
      }
    );
  };
  return (
    <div>
      <p>has send you a friend request</p>
      <button
        type="button"
        className="w-full px-4 py-2 mt-2 font-bold text-white capitalize bg-indigo-700 rounded hover:bg-indigo-800"
        onClick={() => setIsModalOpen(true)}
      >
        respond
      </button>
      {isModalOpen && (
        <ConfirmModal
          title="action"
          modalState={isModalOpen}
          setModalState={setIsModalOpen}
          cbOnAccept={acceptRequest}
          cbOnReject={rejectRequest}
        >
          <p className="font-bold underline capitalize">{userName} says:</p>
          <p className="text-center capitalize">{msg}</p>
        </ConfirmModal>
      )}
    </div>
  );
};

export default ManageRequest;
