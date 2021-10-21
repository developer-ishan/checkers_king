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
import GameCall from "./GameCall";
Modal.setAppElement("#root");

const Game = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);
  const [chats, setChats] = useState([]); //store the chats of current game
  const [game, setGame] = gameValue;
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(true);
  const [color, setColor] = colorValue;
  const [gameId, setGameId] = useState(null);
  let history = useHistory();

  const movePiece = ({ selectedPiece, destination }) => {
    socket.emit("move-piece", { selectedPiece, destination });
  };

  const quitGame = () => {
    console.log("quit-game event triggered...");
    socket.emit("quit-game");
  };

  useEffect(() => {
    console.log("GAMEID in game:", game.id);
    // TODO: add a modal to display the error
    socket.on("game-error", ({ error }) => {
      alert(error);
      history.push("/");
    });

    socket.on("game-status", (game) => {
      console.log("received game from backend", game.id);
      setGameId(game.id);
      setGame(game);
    });

    socket.on("color", (color) => {
      setColor(color);
    });

    socket.on("winner", (winner) => {
      if (winner === null) alert("Game is declared Draw!!");
      else alert(`Winner of the game is ${winner}`);
      history.push("/");
    });

    socket.on("end-game", () => {
      console.log("end-game event caught...");
      history.push("/");
    });
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

  const leaveGame = () => {
    if (color !== null) quitGame();
    else socket.emit("leave-room", { roomId: game.id });
    history.push("/");
  };

  return (
    <>
      {!gameId && <p>lobby.....</p>}
      {gameId && (
        <div className="">
          <GameBar
            turn={game.turn}
            leaveGame={leaveGame}
            offerDraw={offerDraw}
          />
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
              <div className="flex flex-col h-full">
                <GameCall socket={socket} gameId={gameId} />
                <Chat sendChatMsg={sendChatMsg} chats={chats} />
              </div>
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
      )}
    </>
  );
};

export default Game;
