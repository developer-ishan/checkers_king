const { getGameByID } = require("../gameManager");

module.exports = ({ gameId, msg, io, socket }) => {
  const from = socket.id;
  gameId = parseInt(gameId);
  const game = getGameByID(gameId);
  if (game === undefined) return;
  game.chat = [...game.chat, { user: from, msg: msg }];
  //getting the player which is not me
  //that means the opponent
  const opponent = game.players.filter((player) => {
    return player.socket.id != from;
  });
  console.log("game object", game);
  socket.to(opponent[0].socket.id).emit("receive-msg", msg);
};
