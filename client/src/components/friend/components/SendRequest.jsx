import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import {
  getUserIdentification,
  isAuthenticated,
} from "../../../helper/authHelper";
import { SocketContext } from "../../../context/SocketContext";
import ConfirmModal from "../../modal/ConfirmModal";

const SendRequest = ({ userId, setStatus }) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [btnText, setBtnText] = useState("add friend");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msg, setMsg] = useState("Hi there accept my request!");

  const handleSendRequest = () => {
    const token = isAuthenticated();
    if (!token) {
      alert("please login first..");
      return;
    }
    if (token) {
      setBtnText("sending request...");
      socket.emit(
        "send-friend-request",
        {
          token: token,
          receiverId: userId,
          text: msg,
        },
        (resp) => {
          console.log("sended request", resp);
          if (!resp.status) {
            alert("failed to send request, try after a refresh");
            setBtnText("add friend");
            return;
          }
          setBtnText("requested");
          setIsModalOpen(false);
          setStatus({ status: "REQUESTED" });
        }
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-full px-4 py-2 mt-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-purple-500 rounded shadow outline-none active:bg-purple-600 hover:shadow-md hover:bg-purple-600 focus:outline-none ease"
      >
        {btnText}
      </button>
      {isModalOpen && (
        <ConfirmModal
          title="send Friend request"
          modalState={isModalOpen}
          setModalState={setIsModalOpen}
          cbOnAccept={() => handleSendRequest()}
          cbOnReject={() => setIsModalOpen(false)}
          acceptBtnText="send"
          rejectBtnText="cancel"
        >
          <p className="font-bold underline capitalize">message:</p>
          <textarea
            maxLength={250}
            rows={5}
            placeholder="enter your message to the user"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full resize-none dark:text-gray-800 dark:bg-gray-200"
          ></textarea>
        </ConfirmModal>
      )}
    </>
  );
};

export default SendRequest;
