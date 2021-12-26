import React, { useEffect } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import SmallScreenInfoModal from "./SmallScreenInfoModal";

const DrawModal = ({ modalState, setModalState, socket, gameId }) => {
  let history = useHistory();

  const rejectDraw = () => {
    socket.emit("draw-rejected", { gameId });
    setModalState(false);
  };

  const acceptDraw = () => {
    socket.emit("draw-accepted", { gameId });
    setModalState(false);
  };
  //this function is when no option is chossen
  //either close button is pressed or ESC
  const modalClosedWithoutChoosingAnyOption = () => {
    rejectDraw();
  };

  return (
    <SmallScreenInfoModal
      modalState={modalState}
      setModalState={setModalState}
      cbOnRequestClose={modalClosedWithoutChoosingAnyOption}
      title="opponent offered draw"
    >
      <div className="flex flex-col items-center justify-around p-2 md:flex-row capitalize">
        <button
          className="w-full max-w-xs px-4 py-2 m-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-indigo-600 focus:outline-none ease"
          onClick={() => acceptDraw()}
        >
          accept
        </button>
        <button
          className="w-full max-w-xs px-4 py-2 m-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-red-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-red-600 focus:outline-none ease"
          onClick={() => rejectDraw()}
        >
          cancel
        </button>
      </div>
    </SmallScreenInfoModal>
  );
};

export default DrawModal;
