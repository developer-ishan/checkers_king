import React, { useEffect } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";

const DrawModal = ({ modalState, setModalState, socket, gameId }) => {
  let history = useHistory();

  const closeModal = () => {
    socket.emit("draw-rejected", { gameId });
    setModalState(false);
  };
  const rejectDraw = () => {
    socket.emit("draw-rejected", { gameId });
    setModalState(false);
  };

  const acceptDraw = () => {
    socket.emit("draw-accepted", { gameId });
    setModalState(false);
  };

  useEffect(() => {
    socket.on("draw-offered", () => {
      setModalState(true);
    });

    socket.on("draw-accepted", () => {
      alert("opponent accepted the draw");
      history.push("/");
    });

    socket.on("draw-rejected", () => alert("draw rejected: aa gya swad!"));
  }, []);

  return (
    <Modal
      className="absolute z-50 w-2/5 transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
      isOpen={modalState}
      onRequestClose={closeModal}
    >
      <div className="z-50 p-4 bg-gray-500">
        <h1 className="text-center text-white capitalize text-md sm:text-2xl">
          opponent offered draw
        </h1>
        <div className="flex flex-col items-center justify-around p-2 md:flex-row ">
          <button
            className="w-full max-w-xs px-4 py-2 m-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-red-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-red-600 focus:outline-none ease"
            onClick={() => rejectDraw()}
          >
            cancel
          </button>
          <button
            className="w-full max-w-xs px-4 py-2 m-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-indigo-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md hover:bg-indigo-600 focus:outline-none ease"
            onClick={() => acceptDraw()}
          >
            accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DrawModal;
