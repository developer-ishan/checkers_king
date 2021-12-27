import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Game from "./components/game/Game";
import Home from "./components/Landing/Home";
import Profile from "./components/user/Profile";
import Replay from "./components/replay/Replay";
import AppWrapper from "./AppWrapper";
import Lobby from "./components/lobby/Lobby";
import Modal from "react-modal";
import { SocketContext } from "./context/SocketContext";
import { UserContext } from "./context/UserContext";
Modal.setAppElement("#root");
const App = () => {
  const [userState, setUserState] = useContext(UserContext);
  const [games, setGames] = useState([]);
  const [socket, setSocket] = useContext(SocketContext);
  useEffect(() => {}, []);
  return (
    <>
      <BrowserRouter>
        <AppWrapper>
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
            {/* TODO:for testing remove it later */}
            <Route exact path="/lobby">
              <Lobby heading="test" />
            </Route>
          </Switch>
        </AppWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
