const {
  onMovePiece,
  isGameOver,
  endGame,
  initiateMandatoryMove,
  isMandatoryMove,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { aiBotMove } = require("../../helpers/gameBotHelpers/gameBot");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");

module.exports =
  ({ io, socket }) =>
  async ({ selectedPiece, destination }) => {
    console.log("inside move piece handler...");
    let game = onMovePiece({
      player: socket,
      selectedPiece,
      destination,
    });
    if (game === undefined) return;
    sendGameStatus({ socket, gameId: game.id });
    if (isMandatoryMove(selectedPiece, destination) && game.mandatoryMoves)
      await initiateMandatoryMove({ socket, game, selectedPiece, destination });

    // checking if the game is over with a winner
    const winner = isGameOver({ player: socket });
    if (winner !== false) {
      let finishedGame = await endGame({ player: socket, winner });
      io.to(finishedGame.id).emit("winner", winner);
      // sending current ongoing games to all the users
      sendGames(io);
      // removing all the sockets in the room
      io.socketsLeave(finishedGame.id);
      return;
    }

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
        let botGame = onMovePiece({
          player: socket,
          selectedPiece: nextMove.selectedPiece,
          destination: nextMove.destination,
        });
        sendGameStatus({ socket, gameId: botGame.id });
        // handling mandatory moves in the game
        if (isMandatoryMove(selectedPiece, destination) && game.mandatoryMoves)
          await initiateMandatoryMove({
            socket,
            game,
            selectedPiece: nextMove.selectedPiece,
            destination: nextMove.destination,
          });

        if (botGame === undefined) return;
      }

      // checking for bot winning condition for a match
      const winner = isGameOver({ player: socket });
      if (winner !== false) {
        let finishedGame = await endGame({ player: socket, winner });
        io.to(finishedGame.id).emit("winner", winner);
        sendAllGames(io);
        io.socketsLeave(finishedGame.id);
      }
    }
  };
