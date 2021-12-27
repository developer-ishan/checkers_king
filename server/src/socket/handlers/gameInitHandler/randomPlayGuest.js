const {
  setInGameStatus,
} = require("../../helpers/gameBoardHelpers/playerManager");
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
      io,
      player: socket,
      guestId,
      mandatoryMoves,
    });

    if (randomGame !== null) {
      randomGame.players.map((player) => {
        player.socket.join(randomGame.id);
        io.to(player.socket.id).emit("color", player.color);
      });
      await setInGameStatus(io, randomGame);
      const roomSocketCnt = io.sockets.adapter.rooms.get(gameId).size;
      io.to(gameId).emit("head-count", roomSocketCnt);

      sendGameStatus(io, randomGame.id);
      sendAllGames(io);
    }
  };
