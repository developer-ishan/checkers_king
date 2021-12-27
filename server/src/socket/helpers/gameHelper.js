const BOARD_SIZE = 8;
const pieceColor = {
  0: "Empty", // empty
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

const pieceMoves = {
  0: [{}],
  1: [
    { i: 1, j: -1 },
    { i: 1, j: 1 },
  ],
  2: [
    { i: -1, j: 1 },
    { i: -1, j: -1 },
  ],
  3: [
    { i: 1, j: -1 },
    { i: -1, j: 1 },
    { i: 1, j: 1 },
    { i: -1, j: -1 },
  ],
  4: [
    { i: 1, j: -1 },
    { i: -1, j: 1 },
    { i: 1, j: 1 },
    { i: -1, j: -1 },
  ],
};

// checking validity of the coordinates according to the board
const isValid = (x, y) => {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
};

// fetches the number of possible moves for a piece
const getPossibleMoves = ({ board, piece }) => {
  let moves = [];
  const type = board[piece.i][piece.j];

  for (let i = 0; i < pieceMoves[type].length; ++i) {
    let ti = piece.i + pieceMoves[type][i].i,
      tj = piece.j + pieceMoves[type][i].j;

    if (isValid(ti, tj) && pieceColor[board[ti][tj]] !== pieceColor[type]) {
      // for empty space at possible piece move
      if (board[ti][tj] === 0) moves.push({ i: ti, j: tj });
      else {
        // for move with attack on opponent's piece
        let tti = ti + pieceMoves[type][i].i,
          ttj = tj + pieceMoves[type][i].j;
        if (isValid(tti, ttj) && board[tti][ttj] === 0)
          moves.push({ i: tti, j: ttj });
      }
    }
  }
  return moves;
};

// gets the count of a particular type of piece on board
const getPiecesCount = ({ board, type }) => {
  let cnt = 0;

  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      if (board[i][j] === type) cnt++;
    }
  }

  return cnt;
};

// get the vertical positins of the pieces of type on board
const getPiecePositions = ({ board, type }) => {
  let piece = [];

  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      if (board[i][j] == type) piece.push(i);
    }
  }

  return piece;
};

// gets all the pieces of a color from the board
const getAllPieces = ({ board, color }) => {
  let pieces = [];
  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      if (pieceColor[board[i][j]] === color) pieces.push({ i, j });
    }
  }
  return pieces;
};

// function to determing the winning condition of a player; when he cannot move any piece the opponent wins
const getAllMovesCountByPlayer = ({ board, color }) => {
  let pieces = getAllPieces({ board, color }),
    movesCount = 0;
  for (let i = 0; i < pieces.length; ++i) {
    movesCount += getPossibleMoves({ board, piece: pieces[i] }).length;
  }
  return movesCount;
};

const parsePieceMove = (moveString) => {
  if (!moveString)
    return {
      selectedPiece: { i: -1, j: -1 },
      destination: { i: -1, j: -1 },
    };
  return {
    selectedPiece: {
      i: parseInt(moveString.substring(1, 2)),
      j: parseInt(moveString.substring(2, 3)),
    },
    destination: {
      i: parseInt(moveString.substring(3, 4)),
      j: parseInt(moveString.substring(4, 5)),
    },
  };
};

module.exports = {
  getPossibleMoves,
  getPiecesCount,
  getPiecePositions,
  getAllPieces,
  getAllMovesCountByPlayer,
  parsePieceMove,
};
