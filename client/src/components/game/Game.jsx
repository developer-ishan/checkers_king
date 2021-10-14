import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";
import GameBar from "./GameBar";
import Modal from "react-modal";
Modal.setAppElement("#root");

const Game = () => {
  let history = useHistory();

  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);
  const [chats, setChats] = useState([]); //store the chats of current game
  const [game, setGame] = gameValue;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [color, setColor] = colorValue;

  useEffect(() => {
    socket.on("game-status", (game) => {
      console.log(game);
      setGame(game);
    });

    socket.on("color", (color) => {
      console.log("color", color);
      setColor(color);
    });

    socket.on("end-game", () => {
      history.goBack();
    });
  }, []);

  useEffect(() => {
    return () => {
      console.log("gameId", game.id);
      setColor(null);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  //socket is emitting the message sent by the opponent
  //catching it here
  socket.on("receive-msg", (msg) => {
    //push the received message into the chats
    setChats([...chats, { player: "opponent", msg: `${msg}` }]);
  });

  socket.on("draw-offered", () => {
    openModal();
  });
  socket.on("draw-accepted", () => {
    alert("opponent accepted the draw");
    // TODO:exit out this player
  });

  socket.on("draw-rejected", () => alert("draw rejected: aa gya swad!"));

  const sendChatMsg = (msg) => {
    if (msg === "") return;
    //sending this message to the server
    socket.emit("send-msg", { gameId: game.id, msg });
    //pushing the current msg into the chat
    setChats([...chats, { player: "you", msg: `${msg}` }]);
  };

  // used for moving the piece of the player
  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", {
      selectedPiece,
      destination,
    });
  };

  const leaveGame = () => {
    console.log("GAME:", game);
    console.log("gameId", game.id);
    if (color !== null) socket.emit("leave-game");
    else socket.emit("leave-room", { roomId: game.id });
    history.goBack();
  };

  const offerDraw = () => {
    socket.emit("draw-offered", { gameId: game.id });
  };
  const rejectDraw = () => {
    closeModal();
    socket.emit("draw-rejected", { gameId: game.id });
  };

  const acceptDraw = () => {
    closeModal();
    socket.emit("draw-accepted", { gameId: game.id });
  };

  return (
    <div className="">
      <GameBar turn={game.turn} leaveGame={leaveGame} offerDraw={offerDraw} />

      <div className="grid grid-cols-12 px-2 mt-4">
        <div className="col-span-12 col-start-1 text-center text-white md:col-span-8">
          <BoardComponent
            board={game.board}
            color={color}
            movePiece={movePiece}
            turn={game.turn}
          />
        </div>
        <div className="col-span-12 md:col-span-3 md:col-start-9">
          <Chat sendChatMsg={sendChatMsg} chats={chats} />
        </div>
      </div>

      {/* modal for draw */}
      <Modal
        className="absolute z-50 w-2/5 transform top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
        isOpen={modalIsOpen}
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
    </div>
  );
};

export default Game;
