const { movePiece, isGameOver, endGame } = require("../gameManager");
const easyBot = require("../helpers/easyBot");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");
const mandatoryMoves = require("../helpers/mandatoryMoves");
const { saveMatch } = require("../../helpers/matchHelpers");

const isMandatoryMove = ({ game, selectedPiece, destination }) => {
  const diffI = Math.abs(selectedPiece.i - destination.i);
  const diffJ = Math.abs(selectedPiece.j - destination.j);
  console.log("checking for mandatory move...");
  console.log({ diffI, diffJ });
  console.log(game.mandatoryMoves);
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

    if (game === undefined) return;
    sendGameStatus({ socket, gameId: game.id });

    if (isMandatoryMove({ game, selectedPiece, destination })) {
      console.log("mandatory move detected...");
      selectedPiece = destination;
      while (selectedPiece !== false) {
        let mandatoryMove = mandatoryMoves({
          game,
          selectedPiece,
        });
        console.log("mandatory move :- ", mandatoryMove);
        if (mandatoryMove === false) break;
        await new Promise((resolve) => setTimeout(resolve, 300));
        game = movePiece({
          player: socket,
          selectedPiece,
          destination: mandatoryMove,
        });
        selectedPiece = mandatoryMove;
        sendGameStatus({ socket, gameId: game.id });
      }
    }

    const winner = isGameOver({ player: socket });
    if (winner !== false) {
      let finishedGame = endGame({ player: socket, winner });
      console.log("inside onMovePiece, winner ", finishedGame.id);
      console.log("emitting winner event...");
      console.log("finished game", finishedGame);
      console.log("winner", winner);
      io.to(finishedGame.id).emit("winner", winner);
      /**
       * saving finised game
       */
      if (finishedGame.isBot === false) {
        await saveMatch(
          finishedGame.players,
          finishedGame.id,
          finishedGame.pieceMoves,
          finishedGame.createTime,
          new Date(),
          finishedGame.chat
        );
      }
      console.log("save match success");
      sendGames(io);
      io.socketsLeave(finishedGame.id);
    }

    // playing against bot
    if (game.isBot) {
      const nextMove = easyBot({
        board: game.board,
        turn: game.turn,
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
      const botGame = movePiece({
        player: socket,
        selectedPiece: nextMove.selectedPiece,
        destination: nextMove.destination,
      });

      sendGameStatus({ socket, gameId: game.id });

      if (isMandatoryMove({ game: botGame, selectedPiece, destination })) {
        console.log("mandatory move detected...");
        selectedPiece = destination;
        while (selectedPiece !== false) {
          let mandatoryMove = mandatoryMoves({
            game: botGame,
            selectedPiece,
          });
          console.log("mandatory move :- ", mandatoryMove);
          if (mandatoryMove === false) break;
          await new Promise((resolve) => setTimeout(resolve, 300));
          botGame = movePiece({
            player: socket,
            selectedPiece,
            destination: mandatoryMove,
          });
          selectedPiece = mandatoryMove;
          sendGameStatus({ socket, gameId: botGame.id });
        }
      }

      if (botGame === undefined) return;
      const winner = isGameOver({ player: socket });
      if (winner !== false) {
        endGame({ player: socket, winner });
        io.to(finishedGame.id).emit("winner", winner);
        sendGames(io);
      }
    }
  };
