const {
  getGameByID,
  endGame,
} = require("../../../helpers/gameBoardHelpers/gamePlayManager");
const { sendAllGames } = require("../../../helpers/gameStatusHelper");

module.exports = async ({ gameId, io, socket }) => {
  const from = socket.id;
  const game = getGameByID(gameId);
  if (game === undefined) return;
  //getting the player which is not me
  //that means the opponent
  const opponent = game.players.filter((player) => {
    return player.socket.id !== from;
  });
  socket.to(opponent[0].socket.id).emit("draw-accepted");
  // performing the end game procedures
  let finishedGame = await endGame({ player: socket, winner: "Draw" });
  io.to(finishedGame.id).emit("winner", null);
  sendAllGames(io);
  io.socketsLeave(finishedGame.id);
};
