import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import BoardComponent from "./components/board/BoardComponent";
import Chat from "./components/communication/Chat";

import { SocketContext } from "../../context/SocketContext";
import { GameContext } from "../../context/GameContext";
import GameBar from "./components/board/GameBar";
import Modal from "react-modal";
import DrawModal from "../modal/DrawModal";
import InviteCodeModal from "../modal/InviteCodeModal";
import GameCall from "./components/communication/GameCall";
import ErrorModal from "../modal/ErrorModal";
import Lobby from "../lobby/Lobby";
Modal.setAppElement("#root");

const Game = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const { gameValue, colorValue } = useContext(GameContext);
  const [chats, setChats] = useState([]); //store the chats of current game
  const [game, setGame] = useState(null);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(true);
  const [drawDecision, setDrawDecision] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  //these both are made from error modal
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [botLevel, setBotLevel] = useState(-1); //initilay not playing with bot
  const [error, setError] = useState(null);
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
    // TODO: add a modal to display the error
    socket.on("game-error", (error) => {
      console.log("error detected", error);
      // alert(error.title);
      // history.push("/");
      setError(error);
      setIsErrorModalOpen(true);
    });
    socket.on("playing-with-bot", (botLevel) => setBotLevel(botLevel));

    socket.on("game-status", (game) => {
      console.log("received game from backend", game);
      // setGameId(game.id);
      setGame(game);
    });

    socket.on("color", (color) => {
      setColor(color);
    });

    socket.on("winner", (winner) => {
      let msgToUser;
      if (winner === null) msgToUser = "Game is declared Draw!!";
      else if (winner === color)
        msgToUser = "congratulations you won the game!! 🥳🥳";
      else msgToUser = "you lost the game!! 😢😢";

      setMatchResult({
        title: "match Result",
        msg: `${msgToUser}`,
        buttonText: "okay",
        redirectTo: "/",
      });
    });

    socket.on("end-game", () => {
      console.log("end-game event caught...");
      history.push("/");
    });
    socket.on("draw-offered", () => {
      setIsDrawModalOpen(true);
    });

    socket.on("draw-accepted", () => {
      setDrawDecision({
        title: "draw accepted",
        msg: "opponent accepted the draw",
        buttonText: "okay",
        redirecTo: "/",
      });
    });

    socket.on("draw-rejected", () => {
      setDrawDecision({
        title: "draw rejected",
        msg: "opponent rejected the draw",
        buttonText: "okay",
        redirecTo: "",
      });
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

  const boardClass = () => {
    if (botLevel === -1)
      return "col-span-12 col-start-1 text-center text-white md:col-span-8";
    //if playing against bot no need to small the size
    return "col-span-12 col-start-1 text-center text-white";
  };
  return (
    <>
      {!game && <Lobby heading="Lobby" />}
      {/* this modal showsup the error like game not exist or multiple game detected */}
      {error && (
        <ErrorModal
          modalState={isErrorModalOpen}
          setModalState={setIsErrorModalOpen}
          error={error}
        />
      )}
      {game && (
        <div
          className=""
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1525034687081-c702010cb70d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')",
            backgroundSize: "cover",
          }}
        >
          {/* gamebar:this component show the game controls like:leave game,offerdraw,sound controls */}
          <GameBar
            turn={game.turn}
            leaveGame={leaveGame}
            offerDraw={offerDraw}
            botLevel={botLevel}
            gameId={game.id}
            color={color}
          />
          <div className="grid grid-cols-12 px-2 mt-4">
            {/* actual board where game is played */}
            <div className={boardClass()}>
              <BoardComponent
                board={game.board}
                color={color}
                movePiece={movePiece}
                turn={game.turn}
              />
            </div>
            {/* if not playing with bot then only show these components*/}
            {botLevel === -1 && (
              <>
                <div className="col-span-12 md:col-span-3 md:col-start-9">
                  <div className="flex flex-col h-full">
                    {/* video call component */}
                    <GameCall socket={socket} gameId={game.id} />
                    {/* chat component */}
                    <Chat sendChatMsg={sendChatMsg} chats={chats} />
                  </div>
                </div>
              </>
            )}
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
          {/* this modal will show the accept or reject of draw */}
          {drawDecision && (
            <ErrorModal
              modalState={drawDecision}
              setModalState={setDrawDecision}
              error={drawDecision}
            />
          )}
          {/* result of the game*/}
          {matchResult && (
            <ErrorModal
              modalState={matchResult}
              setModalState={setMatchResult}
              error={matchResult}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Game;
