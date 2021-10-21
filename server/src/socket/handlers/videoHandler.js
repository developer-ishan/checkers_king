const { getGameByID } = require("../gameManager");

module.exports = ({ peerId, gameId, io }) => {
  console.log("at server.js:inside video handler ", peerId, gameId);
  const game = getGameByID(gameId);
  if (game === undefined) {
    console.log("undefined game");
    return;
  }
  if (game.players.length === 2) {
    console.log("second player ready");
    io.to(game.players[0].socket.id).emit("opponent-video-ready", peerId);
  }
};
