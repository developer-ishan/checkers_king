const {
  getGames,
  getGameByID,
} = require("../helpers/gameBoardHelpers/gamePlayManager");
const { parsePieceMove } = require("./gameHelper");

// emits the list of all the current ongoing games to all users
exports.sendAllGames = (io) => {
  io.emit("games", getGames());
};

// emits the current state of the game to all users joined into the room
exports.sendGameStatus = (io, gameId) => {
  const game = getGameByID(gameId);
  const lastMove = parsePieceMove(game.pieceMoves[game.pieceMoves.length - 1]);
  io.to(gameId).emit("game-status", {
    id: game.id,
    board: game.board,
    turn: game.turn,
    mandatoryMoves: game.mandatoryMoves,
    isRated: game.isRated,
    lastMove,
  });
};
