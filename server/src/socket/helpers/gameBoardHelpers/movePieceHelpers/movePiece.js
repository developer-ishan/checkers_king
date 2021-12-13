const RED_PAWN = 1;
const BLACK_PAWN = 2;
const RED_QUEEN = 3;
const BLACK_QUEEN = 4;
const TOP_ROW = 0;
const BOTTOM_ROW = 7;

module.exports = ({ board, destination, selectedPiece }) => {
  if (selectedPiece.i === undefined || selectedPiece.j === undefined) return;
  const i = selectedPiece.i;
  const j = selectedPiece.j;
  const di = destination.i;
  const dj = destination.j;
  const distanceI = destination.i - selectedPiece.i;
  const distanceJ = destination.j - selectedPiece.j;
  const oneCellForwardI = i + Math.abs(distanceI) / distanceI;
  const oneCellForwardJ = j + Math.abs(distanceJ) / distanceJ;
  const destinationPiece = board[di][dj];
  const piece = board[i][j];

  // only move to empty spaces
  if (destinationPiece !== 0) return null;

  // must move diagonal
  if (Math.abs(distanceI) !== Math.abs(distanceJ)) return null;

  // red pawn can't move up
  if (piece === RED_PAWN && di <= i) return null;

  // black pawn can't move down
  if (piece === BLACK_PAWN && di >= i) return null;

  // can only move 1 or 2 slots
  if (Math.abs(distanceI) > 2) return null;

  if (Math.abs(distanceI) === 2) {
    // check if jumping a piece
    const middlePiece = board[oneCellForwardI][oneCellForwardJ];
    if (middlePiece === 0) return null;
    if (middlePiece !== piece) {
      board[oneCellForwardI][oneCellForwardJ] = 0;
    } else {
      return null;
    }
  }

  board[di][dj] = board[i][j];
  board[i][j] = 0;

  if (piece === RED_PAWN && di === BOTTOM_ROW) {
    board[di][dj] = RED_QUEEN;
  } else if (piece === BLACK_PAWN && di === TOP_ROW) {
    board[di][dj] = BLACK_QUEEN;
  }

  return board;
};
