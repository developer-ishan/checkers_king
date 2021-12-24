import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import io from "socket.io-client";
import { SocketContext } from "./context/SocketContext";
import Game from "./components/game/Game";
import Home from "./components/Landing/Home";
import { API } from "./config/backend";
import Profile from "./components/user/Profile";
import Replay from "./components/replay/Replay";
import Test from "./Test";
import Lobby from "./components/lobby/Lobby";
import { getUserIdentification } from "./helper/authHelper";
import { GameSoundContext } from "./context/GameSoundContext";

const App = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const [games, setGames] = useState([]);
  const { isMuted, toggleMute, clickSound } = useContext(GameSoundContext);

  // connecting socket-client to the socket server for communication
  useEffect(() => {
    const userIdToken = getUserIdentification();
    const clientSocket = io(API, {
      transports: ["websocket"],
      query: {
        token: userIdToken,
      },
    });
    setSocket(clientSocket);
  }, []);

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
