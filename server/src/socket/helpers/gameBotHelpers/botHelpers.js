const {
  getPossibleMoves,
  getPiecesCount,
  getAllPieces,
} = require("../gameHelper");
const movePiece = require("../gameBoardHelpers/movePieceHelpers/movePiece");
const {
  performMandatoryMove,
} = require("../gameBoardHelpers/movePieceHelpers/mandatoryMoves");

const INF = 99999;

let RED_SCORE, BLACK_SCORE, REDQ_SCORE, BLACKQ_SCORE;

const pieceColor = {
  0: "Empty",
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

// creates a copy of the board by value
const giveDeepCopy = (board) => {
  let copy = [];
  board.forEach((row) => {
    copy.push([...row]);
  });
  return copy;
};

// evaluation function of board; Tries to maximize score for RED & minimize score for BLACK
const evaluatePosition = (board) => {
  return (
    Math.floor(getPiecesCount({ board, type: 1 }) * RED_SCORE) -
    Math.floor(getPiecesCount({ board, type: 2 }) * BLACK_SCORE) +
    Math.floor(getPiecesCount({ board, type: 3 }) * REDQ_SCORE) -
    Math.floor(getPiecesCount({ board, type: 4 }) * BLACKQ_SCORE)
  );
};

// main AI bot function
const ai_algorithm = async (board, depth, maxPlayer) => {
  console.log(depth, maxPlayer);
  // base condition when depth is 0
  if (depth === 0) return { value: evaluatePosition(board) };

  if (maxPlayer) {
    // analysis function for red player
    let maxEval = -INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Red" });

    RED_SCORE = Math.random() * 3;
    REDQ_SCORE = Math.random() * 5;

    console.log("got all pieces of red...");

    for (let i = 0; i < pieces.length; ++i) {
      let moves = getPossibleMoves({ board, piece: pieces[i] });
      for (let j = 0; j < moves.length; ++j) {
        let tmpBoard = giveDeepCopy(board);
        // simulates the current move in the temporary board
        movePiece({
          board: tmpBoard,
          selectedPiece: pieces[i],
          destination: moves[j],
        });
        await performMandatoryMove({
          game: tmpBoard,
          selectedPiece: pieces[i],
          destination: moves[j],
        });
        if (evaluatePosition(tmpBoard) < 20) continue;

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

    BLACK_SCORE = Math.random() * 3;
    BLACKQ_SCORE = Math.random() * 5;

    console.log("got all pieces of black...");

    for (let i = 0; i < pieces.length; ++i) {
      let moves = getPossibleMoves({ board, piece: pieces[i] });
      for (let j = 0; j < moves.length; ++j) {
        let tmpBoard = giveDeepCopy(board);
        // simulates the current move in the temporary board
        console.log("got deep copy...", j + 1);
        movePiece({
          board: tmpBoard,
          selectedPiece: pieces[i],
          destination: moves[j],
        });
        console.log("piece moved");
        await performMandatoryMove({
          game: tmpBoard,
          selectedPiece: pieces[i],
          destination: moves[j],
        });
        console.log("mandatory move performed");
        console.log(tmpBoard);
        if (evaluatePosition(tmpBoard) > -20) continue;

        console.log(tmpBoard);
        console.log(evaluatePosition(tmpBoard));
        console.log("evaluating... further");
        let evaluation = ai_algorithm(tmpBoard, depth - 1, true);
        minEval = Math.min(minEval, evaluation.value);
        if (minEval === evaluation.value)
          bestMove = { selectedPiece: pieces[i], destination: moves[j] };
      }
    }
    return { value: minEval, bestMove };
  }
};

module.exports = {
  ai_algorithm,
};
