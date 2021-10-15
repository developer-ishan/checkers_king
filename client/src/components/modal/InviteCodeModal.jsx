import React, { useState } from "react";
import Modal from "react-modal";

const InviteCodeModal = ({ modalState, setModalState, gameId }) => {
  const [buttonText, setButtonText] = useState("copy");
  const closeModal = () => {
    setModalState(false);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(gameId);
    setButtonText("copied!");
    setTimeout(() => {
      closeModal();
    }, 750);
  };
  return (
    <Modal
      className="absolute z-50 w-full max-w-sm p-2 transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
      isOpen={modalState}
      onRequestClose={closeModal}
    >
      <div className="p-4 space-y-4 bg-gray-600 md:p-8">
        <h1 className="text-xs font-bold text-center text-white capitalize md:text-xl lg:text-2xl">
          share this code with your friend
        </h1>
        <code className="relative block px-2 py-1 text-xl bg-white border-8 border-yellow-300 border-dashed rounded">
          {gameId}
        </code>
        <button
          className="w-full p-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-indigo-600 focus:outline-none ease"
          onClick={() => handleCopy()}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

export default InviteCodeModal;
