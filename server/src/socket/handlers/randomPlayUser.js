const { randomPlayWithUser } = require("../randomManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");

module.exports =
  ({ io, socket }) =>
  async (token, mandatoryMoves) => {
    const randomGame = await randomPlayWithUser({
      player: socket,
      token,
      mandatoryMoves,
    });

    if (randomGame !== null) {
      randomGame.players.map((player) => {
        player.socket.join(randomGame.id);
        player.socket.emit("color", player.color);
      });

      sendGameStatus({ socket, gameId: randomGame.id });
      sendGames(io);
    }
  };
