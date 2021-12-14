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
  // console.log(board);
  const redPieceCnt = getPiecesCount({ board, type: 1 });
  const blackPieceCnt = getPiecesCount({ board, type: 2 });
  const redQPieceCnt = getPiecesCount({ board, type: 3 });
  const blackQPieceCnt = getPiecesCount({ board, type: 4 });

  // console.log({ redPieceCnt, blackPieceCnt, redQPieceCnt, blackQPieceCnt });
  // console.log({ RED_SCORE, REDQ_SCORE, BLACK_SCORE, BLACKQ_SCORE });
  const evalScore =
    redPieceCnt * RED_SCORE -
    blackPieceCnt * BLACK_SCORE +
    redQPieceCnt * REDQ_SCORE -
    blackQPieceCnt * BLACKQ_SCORE;
  console.log("SCORE :- ", evalScore);
  return evalScore;
};

// main AI bot function
const ai_algorithm = (board, depth, maxPlayer, mandatoryMoves) => {
  console.log({ depth, maxPlayer, mandatoryMoves });
  // base condition when depth is 0
  if (depth <= 0) return { value: evaluatePosition(board) };

  if (maxPlayer) {
    console.log("analysis function for red player");
    let maxEval = -INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Red" });

    RED_SCORE = Math.random() * 3;
    REDQ_SCORE = Math.random() * 5;
    BLACK_SCORE = Math.random() * 3;
    BLACKQ_SCORE = Math.random() * 5;

    console.log("got all pieces of red...");

    for (let i = 0; i < pieces.length; ++i) {
      let moves = getPossibleMoves({ board, piece: pieces[i] });
      for (let j = 0; j < moves.length; ++j) {
        let tmpBoard = giveDeepCopy(board);
        // simulates the current move in the temporary board
        console.log(
          "depth : " +
            depth.toString() +
            "; i : " +
            (i + 1).toString() +
            "; j : " +
            (j + 1).toString()
        );
        movePiece({
          board: tmpBoard,
          selectedPiece: pieces[i],
          destination: moves[j],
        });
        console.log("piece moved");
        if (mandatoryMoves) performMandatoryMove(tmpBoard, pieces[i], moves[j]);

        // if (evaluatePosition(tmpBoard) < 20) continue;
        const currentBoardScore = evaluatePosition(tmpBoard);
        console.log(currentBoardScore);
        console.log("evaluating... further");

        // if (evaluatePosition(tmpBoard) >= -10) {
        let evaluation = ai_algorithm(tmpBoard, depth - 1, false);
        console.log("evaluation value at depth " + depth.toString());
        console.log(evaluation);
        maxEval = Math.max(maxEval, evaluation.value);
        if (maxEval === evaluation.value)
          bestMove = { selectedPiece: pieces[i], destination: moves[j] };
      }
      // }
    }
    return { value: maxEval, bestMove };
  } else {
    console.log("analysis function for black player");
    let minEval = INF,
      bestMove = null,
      pieces = getAllPieces({ board, color: "Black" });

    RED_SCORE = Math.random() * 3;
    REDQ_SCORE = Math.random() * 5;
    BLACK_SCORE = Math.random() * 3;
    BLACKQ_SCORE = Math.random() * 5;

    console.log("got all pieces of black...");

    for (let i = 0; i < pieces.length; ++i) {
      let moves = getPossibleMoves({ board, piece: pieces[i] });
      for (let j = 0; j < moves.length; ++j) {
        let tmpBoard = giveDeepCopy(board);
        // simulates the current move in the temporary board
        console.log(
          "depth : " +
            depth.toString() +
            "; i : " +
            (i + 1).toString() +
            "; j : " +
            (j + 1).toString()
        );
        movePiece({
          board: tmpBoard,
          selectedPiece: pieces[i],
          destination: moves[j],
        });
        console.log("piece moved");
        if (mandatoryMoves) performMandatoryMove(tmpBoard, pieces[i], moves[j]);

        // if (evaluatePosition(tmpBoard) > -20) continue;
        const currentBoardScore = evaluatePosition(tmpBoard);
        console.log(currentBoardScore);
        console.log("evaluating... further");

        // if (evaluatePosition(tmpBoard) <= 10) {
        let evaluation = ai_algorithm(tmpBoard, depth - 1, true);
        console.log("evaluation value at depth " + depth.toString());
        console.log(evaluation);
        minEval = Math.min(minEval, evaluation.value);
        if (minEval === evaluation.value)
          bestMove = { selectedPiece: pieces[i], destination: moves[j] };
      }
      // }
    }
    return { value: minEval, bestMove };
  }
};

module.exports = {
  ai_algorithm,
};
