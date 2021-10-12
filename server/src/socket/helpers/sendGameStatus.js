const { getGameByID } = require("../gameManager");

module.exports = ({ socket, gameId }) => {
  const game = getGameByID(gameId);
  socket.emit("game-status", {
    id: game.id,
    board: game.board,
    turn: game.turn,
  });
  socket
    .to(gameId)
    .emit("game-status", { id: game.id, board: game.board, turn: game.turn });
};
