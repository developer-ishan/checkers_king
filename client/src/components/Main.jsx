import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Main({ socket, games, setGames, setGameId }) {
  useEffect(() => {
    socket.on("games", (games) => {
      setGames(games);
    });

    socket.on("your-game-created", (gameId) => {
      setGameId(gameId);
    });
  }, [socket, setGameId, setGameId]);

  const createGame = (name) => {
    socket.emit("create-game", name);
  };

  return (
    <div className="p-6 m-6 text-center text-white">
      <h1>This is Main Component</h1>
      <h1>Ongoing Games</h1>
      {games !== null &&
        games.map((game, id) => (
          <div className="flex p-8 m-4">
            <h1 className="m-2">{game.name}</h1>
            <h2 className="m-2">{game.id}</h2>
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
    </div>
  );
}

export default Main;
