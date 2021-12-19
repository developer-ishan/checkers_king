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

const App = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const [games, setGames] = useState([]);

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
    </>
  );
};

export default App;
