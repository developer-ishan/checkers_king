const { getPossibleMoves } = require("../../gameHelper");
const { sendGameStatus } = require("../../gameStatusHelper");
const movePiece = require("./movePiece");

const giveMandatoryMove = async ({ game, piece }) => {
  // time delay for mandatory move visiblity
  await new Promise((resolve) => setTimeout(resolve, 300));
  let moves = getPossibleMoves({ board: game.board, piece });

  for (let i = 0; i < moves.length; ++i) {
    let di = Math.abs(piece.i - moves[i].i);
    // checking if the move is an attacking move
    if (di >= 2) return moves[i];
  }
  return null;
};

const isMandatoryMove = ({ game, selectedPiece, destination }) => {
  const diffI = Math.abs(selectedPiece.i - destination.i);
  const diffJ = Math.abs(selectedPiece.j - destination.j);
  return diffI === 2 && diffJ === 2 && game.mandatoryMoves;
};

const performMandatoryMove = async ({
  socket,
  game,
  selectedPiece,
  destination,
}) => {
  if (isMandatoryMove({ game, selectedPiece, destination })) {
    console.log("performing mandatory moves...");
    let currPiece = destination;
    let destPiece = await giveMandatoryMove({ game, piece: currPiece });
    // iterating till the conditions for mandatory move is satisfied
    while (destPiece != null) {
      // simulating move without changing the turn in the game
      const moveResult = movePiece({
        board: game.board,
        selectedPiece: currPiece,
        destination: destPiece,
      });
      if (moveResult === null) return;

      if (socket !== undefined) sendGameStatus({ socket, gameId: game.id });
      currPiece = destPiece;
      destPiece = await giveMandatoryMove({ game, piece: currPiece });
    }
  }
};

module.exports = { giveMandatoryMove, isMandatoryMove, performMandatoryMove };
