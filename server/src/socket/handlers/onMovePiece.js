const { movePiece, isGameOver, endGame } = require("../gameManager");
const easyBot = require("../helpers/easyBot");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");

module.exports =
  ({ io, socket }) =>
  ({ selectedPiece, destination }) => {
    const game = movePiece({
      player: socket,
      selectedPiece,
      destination,
    });

    sendGameStatus({ socket, gameId: game.id });
    if (game === undefined) return;
    const winner = isGameOver({ player: socket });
    if (winner !== false) {
      let gameId = endGame({ player: socket, winner });
      console.log("inside onMovePiece, winner ", gameId);
      console.log("emitting winner event...");
      io.to(game.id).emit("winner", winner);
      // sendGames(io);
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
