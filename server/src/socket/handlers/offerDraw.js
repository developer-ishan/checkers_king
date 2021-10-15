const { getGameByID } = require("../gameManager");

module.exports = ({ gameId, io, socket }) => {
  const from = socket.id;
  gameId = parseInt(gameId);
  const game = getGameByID(gameId);
  if (game === undefined) return;
  //getting the player which is not me
  //that means the opponent
  const opponent = game.players.filter((player) => {
    return player.socket.id != from;
  });
  socket.to(opponent[0].socket.id).emit("draw-offered");
};
