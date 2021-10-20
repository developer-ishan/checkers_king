const { getGameByID } = require("../gameManager");

// emits the current state of the game to all users joined into the room
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
