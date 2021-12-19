import React from "react";
import Modal from "react-modal";
import { playSelectSound } from "../../helper/audioHelper";
const SmallScreenInfoModal = ({
  modalState,
  setModalState,
  cbOnRequestClose = undefined,
  title,
  children,
}) => {
  const closeModal = () => {
    playSelectSound();
    setModalState(false);
  };

  //if callback on close not explicitly provided
  //then it will normally close the modal
  if (cbOnRequestClose === undefined) cbOnRequestClose = closeModal;

  return (
    <Modal
      className="absolute w-4/5 max-w-xl transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
      isOpen={modalState}
      onRequestClose={cbOnRequestClose}
    >
      <div className="flex justify-center mx-auto">
        <div className="flex flex-col items-start justify-between w-full sm:w-4/5 h-auto my-20 overflow-hidden bg-white dark:bg-gray-700 rounded-lg shadow-xl">
          <div className="flex flex-row items-baseline justify-around w-full p-3  mb-3 bg-indigo-500 text-white">
            <h2 className="mx-auto text-lg font-semibold tracking-wide uppercase">
              {title}
            </h2>
            <div className="flex flex-row">
              <a
                href="#"
                className="text-xs text-blue-700 text-xl hover:text-red-400 dark:text-pink-400 "
                onClick={() => cbOnRequestClose()}
              >
                &#10006;
              </a>
            </div>
          </div>
          {/* all the content here */}
          <div className="w-full p-2">{children}</div>
        </div>
      </div>
    </Modal>
  );
};

export default SmallScreenInfoModal;
