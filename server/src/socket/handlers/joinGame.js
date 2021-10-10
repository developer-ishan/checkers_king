const { getGameByID, addPlayerToGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  (gameId) => {
    const game = getGameByID(gameId);
    if (game.players.length < 2) {
      const color = addPlayerToGame({ player: socket, gameId });
      socket.emit("color", color);
    }
    sendGames(io);
  };
