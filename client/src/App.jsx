import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "js-cookie";

import { SocketContext } from "./context/SocketContext";
import Game from "./components/game/Game";
import Home from "./components/Landing/Home";
import { API } from "./config/backend";
import Profile from "./components/user/Profile";
import Replay from "./components/replay/Replay";
import Test from "./Test";
import Lobby from "./components/lobby/Lobby";

const App = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const [games, setGames] = useState([]);

  // connecting socket-client to the socket server for communication
  useEffect(() => {
    const clientSocket = io(API, {
      transports: ["websocket"],
    });
    setSocket(clientSocket);
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {socket !== null && <Home games={games} setGames={setGames} />}
          {/* {socket !== null && <Main games={games} setGames={setGames} />} */}
          {socket === null && <Lobby heading="welcome" />}
        </Route>
        <Route exact path="/game">
          <div className="h-full ">
            <Game />
          </div>
        </Route>
        <Route exact path="/user/:userId">
          <Profile />
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
  );
};

export default App;
