const { getGameByID, endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

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
  let finishedGame = await endGame({ player: socket, winner: false });
  io.to(finishedGame.id).emit("winner", null);
  sendGames(io);
  io.socketsLeave(finishedGame.id);
};
