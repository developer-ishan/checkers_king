import React, { useEffect, useContext, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
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
import { playWinSound } from "../../helper/audioHelper";
import { getUserIdentification, signout } from "../../helper/authHelper";
import { API } from "../../config/backend";
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
  const [opponentStatus, setOpponentStatus] = useState(null);
  //these both are made from error modal
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [
    isMultipleDeviceDetectedModalOpen,
    setMultipleDeviceDetectedModalOpen,
  ] = useState(null);

  const [botLevel, setBotLevel] = useState(-1); //initilay not playing with bot
  const [error, setError] = useState(null);
  const [color, setColor] = colorValue;
  const [gameId, setGameId] = useState(null);
  const [playersInfo, setPlayersInfo] = useState(null);
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
    socket.on("ongoing-game", (gameDetails) => {
      console.log("putting old game into play.....");
      const token = getUserIdentification();
      socket.emit("join-game", gameDetails.id, token);
    });
    socket.on("playing-with-bot", (botLevel) => setBotLevel(botLevel));

    socket.on("game-status", (game) => {
      console.log("received game from backend", game);
      // setGameId(game.id);
      setGame(game);
    });
    socket.on("players-info", (players) => {
      console.log("players-info before", players);
      players.sort((a, b) => a.color > b.color);
      console.log("players-info after", players);
      setPlayersInfo(players);
    });

    socket.on("color", (color) => {
      setColor(color);
      console.log("Setting color to ", color);
    });

    socket.on("opponent-status", (status) => {
      console.log("opponent status", status);
      /*opponent status state can have two values
        1.null --> means everything is fine, no need to show modal
        2.object--> this object contains the msg and action required by errorModal
          this object is used for 2 situation
          2.1 --> when waiting for opponent to join the game for first time
          2.2 --> when waiting for opponent to rejoin the game after disconnetion
      */
      if (status === "ready") setOpponentStatus(null);
      else setOpponentStatus(status);
    });

    socket.on("winner", (winner) => {
      let msgToUser;
      console.log("Color : ", color);
      console.log("Winner : ", winner);
      if (winner === null) msgToUser = "Game is declared draw!!";
      else if (winner === color) {
        msgToUser = "Congratulations!! You won the game 🥳🥳";
        playWinSound();
      } else msgToUser = "You lost the game!! 😢😢";

      setMatchResult({
        title: "Match Result",
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
    socket.on("user-error", (error) => {
      setMultipleDeviceDetectedModalOpen(error);
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
      return "col-span-12 col-start-1 text-center text-white lg:col-span-8";
    //if playing against bot no need to small the size
    return "col-span-12 col-start-1 text-center text-white";
  };
  const abandonGame = () => {
    // call a socket to tell to abandon the game
    alert("yet to be implemented");
  };
  const onClosingMultipleDeviceDetectedModal = () => {
    const id = getUserIdentification();
    //if user is guest we cannot do anything
    if (id.startsWith("guest")) return;
    //if a registered user ,logout and then redirect to home page
    else {
      setMultipleDeviceDetectedModalOpen(null);
      signout(() => {
        history.push("/");
      });
    }
  };
  const selfInfo = (color) => {
    let player;
    console.log("inside selfinfo:", playersInfo);
    playersInfo.forEach((p) => {
      if (p.color === color) player = p;
    });
    return (
      <Link
        to={`/user/${player.id}`}
        className="flex items-center"
        title={`click to see ${player.username}'s full profile`}
      >
        <img
          src={`${API}/public/dp/${player.photo}`}
          alt="player's profile pic"
          className="w-8 h-8 mx-1 rounded-full"
        />

        {player.username}
      </Link>
    );
  };
  const opponentInfo = (color) => {
    //it means match is against the bot
    if (botLevel !== -1) {
      return (
        <Link
          className="flex items-center "
          title={`this is a bot,not a real player`}
        >
          <img
            src={`/images/default.png`}
            alt="bot's profile pic"
            className="w-8 h-8 mx-1 rounded-full"
          />

          {`BOT_LVL${botLevel}`}
        </Link>
      );
    }
    //match is against a real player
    let player;
    playersInfo.forEach((p) => {
      if (p.color !== color) player = p;
    });
    return (
      <Link
        to={`/user/${player.id}`}
        className="flex items-center "
        title={`click to see ${player.username}'s full profile`}
      >
        <img
          src={`${API}/public/dp/${player.photo}`}
          alt="player's profile pic"
          className="w-8 h-8 mx-1 rounded-full"
        />

        {player.username}
      </Link>
    );
  };
  return (
    <>
      {isMultipleDeviceDetectedModalOpen && (
        <ErrorModal
          modalState={isMultipleDeviceDetectedModalOpen}
          setModalState={setMultipleDeviceDetectedModalOpen}
          error={isMultipleDeviceDetectedModalOpen}
          cbOnRequestClose={onClosingMultipleDeviceDetectedModal}
        />
      )}
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
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-between p-1 bg-indigo-500"
                  style={{ width: "90vmin" }}
                >
                  {(botLevel !== -1 ||
                    (playersInfo && playersInfo.length > 1)) &&
                    opponentInfo(color)}
                  <p>00:56 s</p>
                </div>
                <BoardComponent
                  board={game.board}
                  color={color}
                  movePiece={movePiece}
                  turn={game.turn}
                />
                <div
                  className="flex items-center justify-between p-1 bg-indigo-500"
                  style={{ width: "90vmin" }}
                >
                  {playersInfo && selfInfo(color)}
                  <p>00:56 s</p>
                </div>
              </div>
            </div>
            {/* if not playing with bot then only show these components*/}
            {botLevel === -1 && (
              <>
                <div className="col-span-12 lg:col-span-3 lg:col-start-9">
                  <div
                    className="flex flex-col items-center justify-around h-full md:flex-row lg:flex-col"
                    style={{ height: "90vmin", minHeight: "80vh" }}
                  >
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
          {/* opponent status,this error will be shown on following cases
            1.waiting for other player
            2.opponent got disconnected .. waiting for rejoin
          */}
          {!isInviteModalOpen && opponentStatus && (
            <ErrorModal
              modalState={opponentStatus}
              setModalState={setOpponentStatus}
              cbOnRequestClose={abandonGame}
              error={opponentStatus}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Game;
