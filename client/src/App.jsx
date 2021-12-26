import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import { SocketContext } from "./context/SocketContext";
import { UserContext } from "./context/UserContext";
import Game from "./components/game/Game";
import Home from "./components/Landing/Home";
import { API } from "./config/backend";
import Profile from "./components/user/Profile";
import Replay from "./components/replay/Replay";
import Test from "./Test";
import Lobby from "./components/lobby/Lobby";
import { getUserIdentification } from "./helper/authHelper";
import { GameSoundContext } from "./context/GameSoundContext";
import ConfirmModal from "./components/modal/ConfirmModal";
import Modal from "react-modal";
Modal.setAppElement("#root");
const App = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const [userState, setUserState] = useContext(UserContext);
  const [games, setGames] = useState([]);
  const [gameInvites, setGameInvites] = useState([]);
  const { isMuted, toggleMute, clickSound } = useContext(GameSoundContext);

  // connecting socket-client to the socket server for communication
  useEffect(() => {
    if (socket) socket.disconnect();
    const userIdToken = getUserIdentification();
    const clientSocket = io(API, {
      transports: ["websocket"],
      query: {
        token: userIdToken,
      },
    });
    setSocket(clientSocket);
    socket &&
      socket.on("game-invite", (invitersInfo) => {
        gameInvites.push(invitersInfo);
      });
    return () => {
      socket && socket.off("game-invite");
    };
  }, [userState.socketReinitialize]);
  const acceptGameInvite = () => {
    alert("accepting game invited not implemented");
  };
  const rejectGameInvite = () => {
    console.log("reject invite");
    setGameInvites((old) => {
      return [...old.splice(0, 1)];
    });
  };

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {socket !== null && <Home games={games} setGames={setGames} />}
            {/* {socket !== null && <Main games={games} setGames={setGames} />} */}
            {socket === null && <Lobby heading="welcome" />}
          </Route>
          <Route exact path="/game">
            <div className="h-full ">
              {socket !== null && <Game />}
              {socket === null && <Lobby heading="hang on.. 🤌" />}
            </div>
          </Route>
          <Route exact path="/user/:userId">
            {socket !== null && <Profile />}
            {socket === null && <Lobby heading="hang on.. 🤌" />}
          </Route>
          <Route exact path="/replay/:matchId">
            <Replay />
          </Route>
          <Route exact path="/test">
            <Test />
          </Route>
          {/* TODO:for testing remove it later */}
          <Route exact path="/lobby">
            <Lobby heading="test" />
          </Route>
        </Switch>
      </BrowserRouter>
      {gameInvites.length > 0 && (
        <ConfirmModal
          title="game invite"
          modalState={gameInvites}
          setModalState={setGameInvites}
          cbOnAccept={acceptGameInvite}
          cbOnReject={rejectGameInvite}
          cbOnRequestClose={rejectGameInvite}
        >
          <p className="text-center capitalize">
            someone has invited you to play game
          </p>
        </ConfirmModal>
      )}
      <button
        data-title="SOUND CONTROL"
        data-intro="you can toggle the sound by clicking this button"
        className="fixed p-2 text-black bg-white rounded-full shadow-lg dark:bg-gray-800 bottom-6 right-6"
        onClick={() => {
          toggleMute();
          if (isMuted) clickSound.play();
        }}
      >
        {isMuted ? (
          <img
            src="https://img.icons8.com/material-outlined/50/000000/no-audio--v1.png"
            className="w-6 h-6"
          />
        ) : (
          <img
            src="https://img.icons8.com/material-outlined/50/000000/speaker.png"
            className="w-6 h-6"
          />
        )}
      </button>
    </>
  );
};

export default App;
