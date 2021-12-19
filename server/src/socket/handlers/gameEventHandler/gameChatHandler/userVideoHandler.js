const {
  getGameByID,
} = require("../../../helpers/gameBoardHelpers/gamePlayManager");

module.exports = ({ peerId, gameId, io }) => {
  const game = getGameByID(gameId);
  if (game === undefined) {
    console.log("undefined game");
    return;
  }
  if (game.players.length === 2) {
    io.to(game.players[0].socket.id).emit("opponent-video-ready", peerId);
  }
};
