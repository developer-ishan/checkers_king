const { getPossibleMoves } = require("../../gameHelper");
const movePiece = require("./movePiece");

const giveMandatoryMove = (board, piece) => {
  let moves = getPossibleMoves({ board, piece });
  if (!moves) return null;

  for (let i = 0; i < moves.length; ++i) {
    let di = Math.abs(piece.i - moves[i].i);
    // checking if the move is an attacking move
    if (di >= 2) return moves[i];
  }
  return null;
};

const isMandatoryMove = (selectedPiece, destination) => {
  const diffI = Math.abs(selectedPiece.i - destination.i);
  const diffJ = Math.abs(selectedPiece.j - destination.j);
  return diffI === 2 && diffJ === 2;
};

const performMandatoryMove = (board, selectedPiece, destination) => {
  if (isMandatoryMove(selectedPiece, destination)) {
    console.log("performing mandatory moves...");
    let currPiece = destination;
    let destPiece = giveMandatoryMove(board, currPiece);
    // iterating till the conditions for mandatory move is satisfied
    while (destPiece != null) {
      // simulating move without changing the turn in the game
      const moveResult = movePiece({
        board: board,
        selectedPiece: currPiece,
        destination: destPiece,
      });
      if (moveResult === null) return;

      currPiece = destPiece;
      destPiece = giveMandatoryMove(board, currPiece);
    }
    console.log("mandatory move performed...");
  }
};

module.exports = { giveMandatoryMove, isMandatoryMove, performMandatoryMove };