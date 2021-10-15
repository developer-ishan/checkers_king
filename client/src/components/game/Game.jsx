import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import BoardComponent from "./BoardComponent";
import Chat from "./Chat";

import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";
import GameBar from "./GameBar";
import Modal from "react-modal";
import DrawModal from "../modal/DrawModal";
import InviteCodeModal from "../modal/InviteCodeModal";
Modal.setAppElement("#root");

const Game = () => {
  let history = useHistory();

  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);
  const [chats, setChats] = useState([]); //store the chats of current game
  const [game, setGame] = gameValue;
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(true);
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

  //socket is emitting the message sent by the opponent
  //catching it here
  socket.on("receive-msg", (msg) => {
    //push the received message into the chats
    setChats([...chats, { player: "opponent", msg: `${msg}` }]);
  });

  const offerDraw = () => {
    socket.emit("draw-offered", { gameId: game.id });
  };

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
      <DrawModal
        modalState={isDrawModalOpen}
        setModalState={setIsDrawModalOpen}
        socket={socket}
        gameId={game.id}
      />
      {/* invite code modal */}
      <InviteCodeModal
        modalState={isInviteModalOpen}
        setModalState={setIsInviteModalOpen}
        gameId={game.id}
      />
    </div>
  );
};

export default Game;
