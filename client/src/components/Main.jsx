import React, { useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

function Main({ games, setGames, setColor, setGameId }) {
  let history = useHistory();
  const [socket, setSocket] = useContext(SocketContext);

  useEffect(() => {
    // receiving the color of our pieces on the board
    socket.on("color", (color) => {
      setColor(color);
    });

    // receiving the created game id on 'create-game' event
    socket.on("your-game-created", (gameId) => {
      setGameId(gameId);
    });

    // receiving the ongoing games information
    socket.on("games", (games) => {
      setGames(games);
    });
  }, []);

  // creates a new and redirects us to the game board
  const createGame = (name) => {
    socket.emit("create-game", name);
    history.push("/game");
  };

  // joins us to the game with game_id 0 for now
  const joinGame = (e) => {
    socket.emit("join-game", 0);
    setGameId(0);
    history.push("/game");
  };

  return (
    <div className="p-6 m-6 text-center text-white">
      <h1>This is Main Component</h1>
      <h1>Ongoing Games</h1>
      {games !== null &&
        games.map((game, ind) => (
          <div className="flex p-8 m-4" key={ind}>
            <h1 className="m-2">{game.name}</h1>
            <h2 className="m-2">{game.id}</h2>
            <h2 className="m-2">Players :- {game.playerCount} / 2</h2>
          </div>
        ))}
      <Link
        className="block w-1/4 px-4 py-2 m-4 font-semibold border border-white rounded hover:text-blue-500 hover:bg-white"
        to="/game"
      >
        Let's Go
      </Link>
      <button
        className="block px-10 py-3 m-4 font-semibold border border-white rounded hover:text-blue-500 hover:bg-white"
        onClick={() => createGame("default")}
      >
        Create New Game
      </button>
      <button
        className="block px-10 py-3 m-4 font-semibold text-white border border-white rounded hover:text-blue-500 hover:bg-white"
        onClick={joinGame}
      >
        Join Game With ID 0
      </button>
    </div>
  );
}

export default Main;
