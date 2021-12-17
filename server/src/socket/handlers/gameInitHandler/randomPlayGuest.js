const {
  randomPlayWithGuest,
} = require("../../helpers/gameBoardHelpers/randomPlayManager");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");

module.exports =
  ({ io, socket }) =>
  async (guestId, mandatoryMoves) => {
    console.log("Creating guest random game");
    const randomGame = await randomPlayWithGuest({
      player: socket,
      guestId,
      mandatoryMoves,
    });

    if (randomGame !== null) {
      randomGame.players.map((player) => {
        player.socket.join(randomGame.id);
        player.socket.emit("color", player.color);
      });

      sendGameStatus(io, randomGame.id);
      sendAllGames(io);
    }
  };
