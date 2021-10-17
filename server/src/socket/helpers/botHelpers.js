const RED_PAWN = 1;
const BLACK_PAWN = 2;
const RED_QUEEN = 3;
const BLACK_QUEEN = 4;
const TOP_ROW = 0;
const BOTTOM_ROW = 7;
const BOARD_SIZE = 8;
const INF = 99999;

const pieceColor = {
  0: "Empty",
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

// possible moves of a particular type of piece
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

// creates a copy of the board by value
const giveDeepCopy = (board) => {
  let copy = [];
  board.forEach((row) => {
    copy.push([...row]);
  });
  return copy;
};

// return TRUE if the position (x, y) lies inside the board
const isValid = (x, y) => {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
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

const simulatePieceMove = ({ board, piece, move }) => {
  const type = board[piece.i][piece.j];
  board[move.i][move.j] = type;
  board[piece.i][piece.j] = 0;
  // attacking the opponnet's piece
  if (Math.abs(move.i - piece.i) >= 2) {
    let ai = (move.i + piece.i) / 2,
      aj = (move.j + piece.j) / 2;
    board[ai][aj] = 0;
  }
  if (type === RED_PAWN && move.i === BOTTOM_ROW)
    board[move.i][move.j] = RED_QUEEN;
  if (type === BLACK_PAWN && move.i === TOP_ROW)
    board[move.i][move.j] = BLACK_QUEEN;
};

// evaluation function of board; Tries to maximize score for RED & minimize score for BLACK
const evaluatePosition = (board) => {
  return (
    getPiecesCount({ board, type: 1 }) -
    getPiecesCount({ board, type: 2 }) +
    getPiecesCount({ board, type: 3 }) -
    getPiecesCount({ board, type: 4 })
  );
};

// main AI bot function
function ai_algorithm(board, depth, maxPlayer) {
  // base condition when depth is 0
  if (depth === 0) return { value: evaluatePosition(board) };

  if (maxPlayer) {
    // analysis function for red player
    let maxEval = -INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Red" });
    for (let i = 0; i < pieces.length; ++i) {
      let moves = getPossibleMoves({ board, piece: pieces[i] });
      for (let j = 0; j < moves.length; ++j) {
        let tmpBoard = giveDeepCopy(board);
        // simulates the current move in the temporary board
        simulatePieceMove({
          board: tmpBoard,
          piece: pieces[i],
          move: moves[j],
        });
        let evaluation = ai_algorithm(tmpBoard, depth - 1, false);
        maxEval = Math.max(maxEval, evaluation.value);
        if (maxEval === evaluation.value)
          bestMove = { selectedPiece: pieces[i], destination: moves[j] };
      }
    }
    return { value: maxEval, bestMove };
  } else {
    // analysis function for black player
    let minEval = INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Black" });
    for (let i = 0; i < pieces.length; ++i) {
      let moves = getPossibleMoves({ board, piece: pieces[i] });
      for (let j = 0; j < moves.length; ++j) {
        let tmpBoard = giveDeepCopy(board);
        // simulates the current move in the temporary board
        simulatePieceMove({
          board: tmpBoard,
          piece: pieces[i],
          move: moves[j],
        });
        let evaluation = ai_algorithm(tmpBoard, depth - 1, true);
        minEval = Math.min(minEval, evaluation.value);
        if (minEval === evaluation.value)
          bestMove = { selectedPiece: pieces[i], destination: moves[j] };
      }
    }
    return { value: minEval, bestMove };
  }
}

module.exports = {
  ai_algorithm,
  getAllPieces,
  getPossibleMoves,
  getPiecesCount,
  simulatePieceMove,
};
