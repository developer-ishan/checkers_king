const {
  endGame,
  getColorOfPlayer,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const {
  resetInGameStatus,
} = require("../../helpers/gameBoardHelpers/playerManager");
const { sendAllGames } = require("../../helpers/gameStatusHelper");

// user calling this function loses the game
module.exports =
  ({ io, socket }) =>
  async () => {
    console.log("'quit-game' event called...");
    const winner = getColorOfPlayer({ player: socket });

    const endedGame = await endGame({ player: socket, winner });
    if (endedGame === null) return;

    const roomId = endedGame.id;
    // emitting events to respective rooms
    io.to(roomId).emit("end-game", winner);
    await resetInGameStatus(io, endedGame);
    // removing all the users of this room
    io.socketsLeave(roomId);
    sendAllGames(io);
  };
