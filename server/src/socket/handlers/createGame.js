const { createNewGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  (name) => {
    const newGame = createNewGame({ player: socket, name });
    socket.join(newGame.id);
    sendGames(io);
    socket.emit("game-status", {
      id: newGame.id,
      board: newGame.board,
      turn: newGame.turn,
    });
    socket.emit("color", "Red");
  };
