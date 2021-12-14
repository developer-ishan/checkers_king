const {
  getGames,
  getGameByID,
} = require("../helpers/gameBoardHelpers/gamePlayManager");

exports.sendAllGames = (io) => {
  io.emit("games", getGames());
};

// emits the current state of the game to all users joined into the room
exports.sendGameStatus = ({ socket, gameId }) => {
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
