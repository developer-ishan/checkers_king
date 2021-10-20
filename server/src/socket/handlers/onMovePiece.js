const { movePiece, isGameOver, endGame } = require("../gameManager");
const { aiBotMove } = require("../helpers/gameBot");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");
const { giveMandatoryMove } = require("../helpers/mandatoryMoves");
const { simulatePieceMove } = require("../helpers/botHelpers");

// checks if the current move supports mandatory move
const isMandatoryMove = ({ game, selectedPiece, destination }) => {
  const diffI = Math.abs(selectedPiece.i - destination.i);
  const diffJ = Math.abs(selectedPiece.j - destination.j);
  return diffI === 2 && diffJ === 2 && game.mandatoryMoves;
};

module.exports =
  ({ io, socket }) =>
  async ({ selectedPiece, destination }) => {
    let game = movePiece({
      player: socket,
      selectedPiece,
      destination,
    });

    // checks for invalid game condition
    if (game === undefined) return;
    sendGameStatus({ socket, gameId: game.id });

    // making the mandatory move in the board
    if (isMandatoryMove({ game, selectedPiece, destination })) {
      let currPiece = destination;
      let destPiece = await giveMandatoryMove({ game, piece: currPiece });
      // iterating till the conditions for mandatory move is satisfied
      while (destPiece != null) {
        // simulating move without changing the turn in the game
        simulatePieceMove({
          board: game.board,
          piece: currPiece,
          move: destPiece,
        });
        sendGameStatus({ socket, gameId: game.id });
        currPiece = destPiece;
        destPiece = await giveMandatoryMove({ game, piece: currPiece });
      }
    }

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
      const nextMove = aiBotMove({
        board: game.board,
        level: game.botLevel,
        turn: game.turn,
      });
      // delay for move visiblity
      const delay = game.botLevel === 6 ? 200 : 300;
      await new Promise((resolve) => setTimeout(resolve, delay));
      // next move is null if the bot doesn't have any possible moves, which is basically a win condition
      if (nextMove != null) {
        let botGame = movePiece({
          player: socket,
          selectedPiece: nextMove.selectedPiece,
          destination: nextMove.destination,
        });
        sendGameStatus({ socket, gameId: botGame.id });

        // checks if the piece can inititate a mandatory move
        if (
          isMandatoryMove({
            game: botGame,
            selectedPiece: nextMove.selectedPiece,
            destination: nextMove.destination,
          })
        ) {
          let currPiece = nextMove.destination;
          let destPiece = await giveMandatoryMove({
            game: botGame,
            piece: currPiece,
          });
          // iterating till the conditions for mandatory move is satisfied
          while (destPiece != null) {
            // simulating move without changing the turn in the game
            simulatePieceMove({
              board: botGame.board,
              piece: currPiece,
              move: destPiece,
            });
            sendGameStatus({ socket, gameId: botGame.id });
            currPiece = destPiece;
            destPiece = await giveMandatoryMove({
              game: botGame,
              piece: currPiece,
            });
          }
        }
        if (botGame === undefined) return;
      }

      // checking for winning condition for a match
      const winner = isGameOver({ player: socket });
      if (winner !== false) {
        let finishedGame = await endGame({ player: socket, winner });
        io.to(finishedGame.id).emit("winner", winner);
        sendGames(io);
        io.socketsLeave(finishedGame.id);
      }
    }
  };
