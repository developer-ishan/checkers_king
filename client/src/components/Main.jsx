import React, { useEffect, useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { authenticate, isAuthenticated } from "../helper/authHelper";

function Main({ games, setGames }) {
  let history = useHistory();
  const [socket, setSocket] = useContext(SocketContext);
  const [joinGameField, setJoinGameField] = useState(0);
  const [createGameField, setCreateGameField] = useState("");
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    // receiving the ongoing games information
    socket.on("games", (games) => {
      setGames(games);
    });
  }, []);

  // creates a new and redirects us to the game board
  const createGame = () => {
    const token = isAuthenticated();
    socket.emit("create-game", createGameField, isBot, token);
    history.push("/game");
  };

  // joins us to the game with game_id 0 for now
  // TODO: catching error on joining non-existent gaem
  const joinGame = (e) => {
    const token = isAuthenticated();
    socket.emit("join-game", joinGameField, token);
    history.push("/game");
  };

  return (
    <div className="p-6 m-6 text-center text-white">
      <h1>This is Main Component</h1>
      <div className="flex flex-col w-3/4">
        <h1>Ongoing Games</h1>
        {games !== null &&
          games.map((game, ind) => (
            <div className="flex p-8 m-4" key={ind}>
              <h1 className="m-2">Title :- {game.name}</h1>
              <h2 className="m-2">ID :- {game.id}</h2>
              <h2 className="m-2">Players :- {game.playerCount} / 2</h2>
            </div>
          ))}
      </div>

      <div className="flex flex-col w-1/2">
        <Link
          className="block w-1/4 px-4 py-2 m-4 font-semibold border border-white rounded hover:text-blue-500 hover:bg-white"
          to="/game"
        >
          Let's Go
        </Link>
      </div>

      <div className="flex flex-col w-1/2">
        <div>
          Game Title
          <input
            type="text"
            className="p-1 mx-2 text-black"
            value={createGameField}
            onChange={(e) => {
              setCreateGameField(e.target.value);
            }}
          />
          {createGameField}
        </div>
        <div>
          <input
            className="p-1 mx-2"
            type="checkbox"
            checked={isBot}
            onChange={() => {
              setIsBot(!isBot);
            }}
          />
          Play With Bot
          {isBot}
        </div>
        <button
          className="block px-10 py-3 m-4 font-semibold border border-white rounded hover:text-blue-500 hover:bg-white"
          onClick={() => createGame()}
        >
          Create New Game
        </button>
      </div>
      <div className="flex flex-col w-1/2">
        <input
          type="number"
          className="p-1 mx-2 text-black"
          value={joinGameField}
          onChange={(e) => {
            setJoinGameField(e.target.value);
          }}
        />
        <button
          className="block px-10 py-3 m-4 font-semibold text-white border border-white rounded hover:text-blue-500 hover:bg-white"
          onClick={joinGame}
        >
          Join Game With ID {joinGameField}
        </button>
      </div>
    </div>
  );
}

export default Main;
