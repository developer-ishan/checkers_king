const {
  onMovePiece,
  isGameOver,
  endGame,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { aiBotMove } = require("../../helpers/gameBotHelpers/gameBot");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");
const { emitGameError } = require("../../helpers/errorHelper");

// check if the game has ended & a winner is declared
const isWinnerDeclared = async (io, socket) => {
  const winner = isGameOver({ player: socket });
  console.log("Winner of the game ", winner);
  if (winner !== false) {
    let finishedGame = await endGame({ player: socket, winner });
    io.to(finishedGame.id).emit("winner", winner);
    sendAllGames(io);
    io.socketsLeave(finishedGame.id);
  }
  return winner;
};

module.exports =
  ({ io, socket }) =>
  async ({ selectedPiece, destination }) => {
    console.log("inside move piece handler...");
    let game = await onMovePiece({
      io,
      player: socket,
      selectedPiece,
      destination,
    });
    if (game === undefined) {
      // error for invalid move or illegal player of game
      emitGameError(
        socket,
        "Invalid Move!",
        "Attention! the move you are trying to make seems invalid!!",
        "Okay",
        "/game"
      );
      return;
    }
    sendGameStatus(io, game.id);
    const gameResults = await isWinnerDeclared(io, socket);
    if (gameResults !== false) return;

    console.log("moving to bot move...");

    /* --------------------------------- User game with game bot --------------------------------- */
    if (game.isBot) {
      // level should only be kept in range [1, 5]
      console.log("determining next move of bot...");
      const nextMove = aiBotMove({
        board: game.board,
        level: game.botLevel,
        turn: game.turn,
        mandatoryMoves: game.mandatoryMoves,
      });
      // next move is null if the bot doesn't have any possible moves, which is basically a win condition
      if (nextMove != null) {
        console.log("predicted next move :- ", nextMove);
        let botGame = await onMovePiece({
          io,
          player: socket,
          selectedPiece: nextMove.selectedPiece,
          destination: nextMove.destination,
        });
        sendGameStatus(io, botGame.id);
      }
      const gameResults = await isWinnerDeclared(io, socket);
      if (gameResults !== false) return;
    }
    /* ------------------------- User game with game bot ------------------------- */
  };
