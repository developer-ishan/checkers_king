const { getGameByID, addPlayerToGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");

module.exports =
  ({ io, socket }) =>
  async (gameId, token) => {
    const game = getGameByID(gameId);
    // TODO: return error on undefined game
    if (game === undefined) return;

    socket.join(gameId);
    if (game.players.length < 2) {
      const color = await addPlayerToGame({
        player: socket,
        gameId: gameId,
        token: token,
      });
      socket.emit("color", color);
    }
    sendGameStatus({ socket, gameId });
    sendGames(io);
  };
