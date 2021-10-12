const { getGameByID, addPlayerToGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");

module.exports =
  ({ io, socket }) =>
  (gameId) => {
    console.log("for socket ", socket.id);
    gameId = parseInt(gameId);
    const game = getGameByID(gameId);
    if (game === undefined) return;
    console.log("got the game");
    socket.join(gameId);
    console.log("joined the game");
    if (game.players.length < 2) {
      const color = addPlayerToGame({
        player: socket,
        gameId: gameId,
      });
      console.log("joined as player");
      socket.emit("color", color);
    }
    sendGameStatus({ socket, gameId });
    sendGames(io);
  };
