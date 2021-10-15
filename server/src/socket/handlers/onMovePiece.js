const { movePiece, isGameOver, endGame } = require("../gameManager");
const easyBot = require("../helpers/easyBot");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");
const { saveMatch } = require("../../helpers/matchHelpers");
module.exports =
  ({ io, socket }) =>
  async ({ selectedPiece, destination }) => {
    const game = movePiece({
      player: socket,
      selectedPiece,
      destination,
    });
    console.log(game.pieceMoves);
    if (game === undefined) return;
    sendGameStatus({ socket, gameId: game.id });
    const winner = isGameOver({ player: socket });
    if (winner !== false) {
      let finishedGame = endGame({ player: socket, winner });
      console.log("inside onMovePiece, winner ", finishedGame.id);
      console.log("emitting winner event...");
      io.to(finishedGame.id).emit("winner", winner);

      /**
       * saving finised game
       */
      await saveMatch(
        finishedGame.players,
        finishedGame.id,
        finishedGame.pieceMoves,
        new Date(),
        new Date(),
        [{ text: "hi" }, { text: "saved chat" }]
      );
      sendGames(io);
      io.socketsLeave(finishedGame.id);
    }

    // playing against bot
    if (game.isBot) {
      const nextMove = easyBot({
        board: game.board,
        turn: game.turn,
      });

      console.log(nextMove);
      const botGame = movePiece({
        player: socket,
        selectedPiece: nextMove.selectedPiece,
        destination: nextMove.destination,
      });

      sendGameStatus({ socket, gameId: game.id });
      console.log("inside onMovePiece function...");
      if (botGame === undefined) return;
      const winner = isGameOver({ player: socket });
      if (winner !== false) {
        endGame({ player: socket, winner });
        sendGames(io);
      }
    }
  };
