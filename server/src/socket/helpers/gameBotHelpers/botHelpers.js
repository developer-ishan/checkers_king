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

const setPieceScoreValues = () => {
  RED_SCORE = Math.random() * 3;
  REDQ_SCORE = Math.random() * 5;
  BLACK_SCORE = Math.random() * 3;
  BLACKQ_SCORE = Math.random() * 5;
};

// evaluation function of board; Tries to maximize score for RED & minimize score for BLACK
const evaluatePosition = (board) => {
  const redPieceCnt = getPiecesCount({ board, type: 1 });
  const blackPieceCnt = getPiecesCount({ board, type: 2 });
  const redQPieceCnt = getPiecesCount({ board, type: 3 });
  const blackQPieceCnt = getPiecesCount({ board, type: 4 });

  const evalScore =
    redPieceCnt * RED_SCORE -
    blackPieceCnt * BLACK_SCORE +
    redQPieceCnt * REDQ_SCORE -
    blackQPieceCnt * BLACKQ_SCORE;
  return evalScore;
};

const performBotHeuristics = (board, depth, maxPlayer, mandatoryMoves) => {
  setPieceScoreValues();
  return ai_algorithm(board, depth, maxPlayer, mandatoryMoves);
};

// main AI bot function
const ai_algorithm = (board, depth, maxPlayer, mandatoryMoves) => {
  // base condition when depth is 0
  if (depth <= 0) return { value: evaluatePosition(board) };

  if (maxPlayer) {
    // console.log("analysis function for red player");
    let maxEval = -INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Red" });

    for (let i = 0; i < pieces.length; ++i) {
      if (evaluatePosition(board) > -25) {
        let moves = getPossibleMoves({ board, piece: pieces[i] });
        for (let j = 0; j < moves.length; ++j) {
          let tmpBoard = giveDeepCopy(board);
          // simulates the current move in the temporary board
          movePiece({
            board: tmpBoard,
            selectedPiece: pieces[i],
            destination: moves[j],
          });
          if (mandatoryMoves)
            performMandatoryMove(tmpBoard, pieces[i], moves[j]);

          let evaluation = ai_algorithm(
            tmpBoard,
            depth - 1,
            false,
            mandatoryMoves
          );

          maxEval = Math.max(maxEval, evaluation.value);
          if (maxEval === evaluation.value)
            bestMove = { selectedPiece: pieces[i], destination: moves[j] };
        }
        // }
      }
    }
    return { value: maxEval, bestMove };
  } else {
    // console.log("analysis function for black player");
    let minEval = INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Black" });

    for (let i = 0; i < pieces.length; ++i) {
      if (evaluatePosition(board) < 25) {
        let moves = getPossibleMoves({ board, piece: pieces[i] });
        for (let j = 0; j < moves.length; ++j) {
          let tmpBoard = giveDeepCopy(board);
          // simulates the current move in the temporary board
          movePiece({
            board: tmpBoard,
            selectedPiece: pieces[i],
            destination: moves[j],
          });

          if (mandatoryMoves)
            performMandatoryMove(tmpBoard, pieces[i], moves[j]);

          // if (evaluatePosition(tmpBoard) <= 10) {
          let evaluation = ai_algorithm(
            tmpBoard,
            depth - 1,
            true,
            mandatoryMoves
          );

          // console.log(evaluation);
          minEval = Math.min(minEval, evaluation.value);
          if (minEval === evaluation.value)
            bestMove = { selectedPiece: pieces[i], destination: moves[j] };
        }
      }
    }
    return { value: minEval, bestMove };
  }
};

module.exports = {
  performBotHeuristics,
};
