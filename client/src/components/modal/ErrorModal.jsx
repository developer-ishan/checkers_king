import React from "react";
import Modal from "react-modal";
import { useHistory } from "react-router";
const ErrorModal = ({
  modalState,
  setModalState,
  cbOnRequestClose = null,
  error,
}) => {
  let history = useHistory();
  const closeModal = () => {
    setModalState(false);
    history.push(error.redirectTo);
  };

  //if callback on close not explicitly provided
  //then it will normally close the modal
  if (cbOnRequestClose === null) cbOnRequestClose = closeModal;
  return (
    <Modal
      className="absolute w-11/12 max-w-md transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 capitalize"
      isOpen={modalState}
      onRequestClose={cbOnRequestClose}
    >
      <div class="flex justify-center mx-auto capitalize">
        <div class="flex flex-col items-start justify-between w-full sm:w-4/5 h-auto my-20 overflow-hidden bg-white dark:bg-gray-700 rounded-lg shadow-xl">
          <div class="flex flex-row items-baseline justify-around w-full p-4 pb-0 mb-3 ">
            <h2 class="mx-auto text-2xl font-semibold tracking-wide capitalize text-center">
              {error.title}
            </h2>
          </div>
          <p className="p-3 mx-auto text-lg text-center md:text-xl">
            {error.msg}
          </p>

          <button
            type="submit"
            className="w-full p-4 text-white capitalize bg-indigo-500 hover:bg-indigo-600"
            onClick={() => cbOnRequestClose()}
          >
            {error.buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
