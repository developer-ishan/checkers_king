const { getGameByID, addPlayerToGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");

module.exports =
  ({ io, socket }) =>
  async (gameId, token) => {
    console.log("for socket ", socket.id);
    const game = getGameByID(gameId);
    // TODO: return error on undefined game
    if (game === undefined) return;

    console.log("got the game");
    socket.join(gameId);
    console.log("joined the game");

    if (game.players.length < 2) {
      console.log(`adding ${socket.id} as 2nd player`);
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
