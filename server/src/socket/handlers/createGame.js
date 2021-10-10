const { createNewGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  (name) => {
    const newGame = createNewGame({ player: socket, name });
    sendGames(io);
    socket.emit("your-game-created", newGame.id);
    socket.emit("color", "Red");
  };
