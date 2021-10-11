import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";

import { SocketContext } from "./context/SocketContext";
import { GameContext } from "./context/GameContext";
import Game from "./components/game/Game";
import Main from "./components/Main";
import { API } from "./config/backend";

const App = () => {
  const [socket, setSocket] = useContext(SocketContext);
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState(null);
  const { gameValue, colorValue } = useContext(GameContext);

  const [game, setGame] = gameValue;
  const [color, setColor] = colorValue;

  // connecting socket-client to the socket server for communication
  useEffect(() => {
    const clientSocket = io(API, {
      transports: ["websocket"],
    });
    setSocket(clientSocket);
  }, [setSocket]);

  // updating the game state to the current game user is in
  useEffect(() => {
    const gm = games.find((g) => g.id === gameId);
    if (gm !== undefined) setGame({ board: gm.board, turn: gm.turn });
  }, [gameId, games]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500">
            <header>
              <p className="text-4xl text-center text-white capitalize">
                hello peter
              </p>
            </header>
            {socket !== null && (
              <Main
                games={games}
                setGames={setGames}
                setGameId={setGameId}
                setColor={setColor}
              />
            )}
          </div>
        </Route>
        <Route exact path="/game">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500">
            <Game />
          </div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
