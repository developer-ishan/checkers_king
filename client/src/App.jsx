import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";

import { SocketContext } from "./context/SocketContext";
import Game from "./components/game/Game";
import Home from "./components/Landing/Home";
import { API } from "./config/backend";
import Profile from "./components/user/Profile";
import Replay from "./components/replay/Replay";
import Test from "./Test";
import Lobby from "./components/lobby/Lobby";
import { getUserIdentification, signout } from "./helper/authHelper";
import ErrorModal from "./components/modal/ErrorModal";
import { playWelcomeSound } from "./helper/audioHelper";

const App = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const [games, setGames] = useState([]);
  const [isUserErrorModalOpen, setIsUserErrorModalOpen] = useState(false);

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

  useEffect(() => {
    socket &&
      socket.on("user-error", (error) => {
        console.log(error);
        // setError(error);
        setIsUserErrorModalOpen(error);
      });
  }, [socket]);

  const onClosingMultipleDeviceDetectedModal = () => {
    console.log("closing multiple device detection");
    const id = getUserIdentification();
    console.log("id", id);
    //if user is guest just close the tab
    //this will not work, not allowed by browser
    if (id.startsWith("guest")) window.open("", "_self").window.close();
    //if a registered user ,logout
    else signout();
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
      {isUserErrorModalOpen && (
        <ErrorModal
          modalState={isUserErrorModalOpen}
          setModalState={setIsUserErrorModalOpen}
          error={isUserErrorModalOpen}
          cbOnRequestClose={onClosingMultipleDeviceDetectedModal}
        />
      )}
    </>
  );
};

export default App;
