import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import Game from "./components/game/Game";
import Home from "./components/Landing/Home";
import Main from "./components/Main";

function App() {
  const [socket, setSocket] = useState(null);
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState({ board: [] });
  const [color, setColor] = useState(null);

  useEffect(() => {
    const gm = games.find((g) => g.id === gameId);
    console.log("gm", gm);
    console.log("game", game);
    if (gm !== undefined) {
      setGame({ board: gm.board });
      setColor(gm.color);
    }
  }, [gameId, games]);

  useEffect(() => {
    const clientSocket = io("http://localhost:8000", {
      transports: ["websocket"],
    });
    setSocket(clientSocket);
    return () => {
      clientSocket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500">
            <Home />
            {socket !== null && (
              <Main
                socket={socket}
                games={games}
                setGameId={setGameId}
                setGames={setGames}
              />
            )}
          </div>
        </Route>
        <Route exact path="/game">
          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500">
            <Game game={game} color={color} />
          </div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
