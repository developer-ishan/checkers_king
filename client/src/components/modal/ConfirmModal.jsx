import React from "react";
import SmallScreenInfoModal from "./SmallScreenInfoModal";

const ConfirmModal = ({
  modalState,
  setModalState,
  title = "confirm",
  acceptBtnText = "accept",
  rejectBtnText = "reject",
  cbOnAccept,
  cbOnReject,
  cbOnRequestClose,
  children,
}) => {
  //this function is when no option is chossen
  //either close button is pressed or ESC

  return (
    <SmallScreenInfoModal
      modalState={modalState}
      setModalState={setModalState}
      cbOnRequestClose={cbOnRequestClose}
      title={title}
    >
      <div className="p-2">{children}</div>
      <div className="flex flex-col items-center justify-around p-2 md:flex-row ">
        <button
          className="w-full max-w-xs px-4 py-2 m-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-indigo-600 focus:outline-none ease"
          onClick={cbOnAccept}
        >
          {acceptBtnText}
        </button>
        <button
          className="w-full max-w-xs px-4 py-2 m-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-red-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-red-600 focus:outline-none ease"
          onClick={cbOnReject}
        >
          {rejectBtnText}
        </button>
      </div>
    </SmallScreenInfoModal>
  );
};

export default ConfirmModal;
