const { movePiece, isGameOver, endGame } = require("../gameManager");
const sendGameStatus = require("../helpers/sendGameStatus");

module.exports =
  ({ io, socket }) =>
  ({ selectedPiece, destination }) => {
    const game = movePiece({
      player: socket,
      selectedPiece,
      destination,
    });
    if (game === undefined) return;
    const winner = isGameOver({ player: socket });
    if (winner !== false) endGame({ player: socket, winner });
    sendGameStatus({ socket, gameId: game.id });
  };
