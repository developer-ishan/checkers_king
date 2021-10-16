const RED_PAWN = 1;
const BLACK_PAWN = 2;
const RED_QUEEN = 3;
const BLACK_QUEEN = 4;
const TOP_ROW = 0;
const BOTTOM_ROW = 7;

const ATTACK_POINTS = 3 + Math.floor(Math.random() * 6);
const DEFENSE_POINTS = 3 + Math.floor(Math.random() * 5);
const EMPTY_POINTS = 1 + Math.floor(Math.random() * 4);
const DANGER_POINTS = 2 + Math.floor(Math.random() * 3);
const QUEEN_POINTS = 1 + Math.floor(Math.random() * 6);

const player = {
  0: "Empty",
  1: "Red", // pawn
  2: "Black", // pawn
  3: "Red", // queen
  4: "Black", // queen
};

const playerMoves = {
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

const diagonalCells = [
  { i: 1, j: -1 },
  { i: -1, j: 1 },
  { i: 1, j: 1 },
  { i: -1, j: -1 },
];

const isValid = (x, y) => {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
};

const evaluatePosition = ({ board, tposi, tposj, boardPiece }) => {
  console.log("tposi " + tposi + " tposj " + tposj);
  let calculatedValue = 0;
  if (
    (boardPiece === RED_PAWN && tposi === BOTTOM_ROW) ||
    (boardPiece === BLACK_PAWN && tposj === TOP_ROW)
  )
    calculatedValue +=
      boardPiece !== BLACK_QUEEN || boardPiece !== RED_QUEEN ? QUEEN_POINTS : 0;

  for (let i = 0; i < 4; ++i) {
    let tmpi = tposi + diagonalCells[i].i,
      tmpj = tposj + diagonalCells[i].j;
    if (!isValid(tmpi, tmpj)) continue;

    if (board[tmpi][tmpj] === 0) calculatedValue += EMPTY_POINTS;
    if (player[board[tmpi][tmpj]] === player[boardPiece])
      calculatedValue += DEFENSE_POINTS;
    else calculatedValue -= DANGER_POINTS;
    if (board[tmpi][tmpj] === 3 || board[tmpi][tmpj] === 4)
      calculatedValue -= Math.floor(Math.random() * 3);
  }
  console.log(
    "newPosi " + tposi + " newPosj " + tposj + " value ",
    calculatedValue
  );
  return calculatedValue + Math.floor(Math.random() * 4);
};

const calculateBestPossibleMoves = ({ board, posi, posj }) => {
  console.log("posi " + posi + " posj " + posj);
  let pieceValue = -100,
    pieceMove = null;

  let boardPiece = board[posi][posj]; // board piece
  let movesSet = playerMoves[boardPiece];
  console.log("bp ", boardPiece);

  for (let i = 0; i < movesSet.length; ++i) {
    if (movesSet[i] === undefined) continue;
    let tposi = posi + movesSet[i].i;
    let tposj = posj + movesSet[i].j;
    if (tposi === undefined || tposj === undefined || !isValid(tposi, tposj))
      continue;
    let tposBoardPiece = board[tposi][tposj];

    console.log("tposi " + tposi + " tposj " + tposj);
    if (player[boardPiece] !== player[tposBoardPiece]) {
      if (tposBoardPiece === 0) {
        board[posi][posj] = 0;
        board[tposi][tposj] = boardPiece;
        let tmp1 = evaluatePosition({
          board,
          tposi,
          tposj,
          boardPiece,
        });
        board[posi][posj] = boardPiece;
        board[tposi][tposj] = 0;

        console.log("tposi - " + tposi + "; tposj - " + tposj, tmp1);
        if (tmp1 > pieceValue) {
          pieceValue = tmp1;
          pieceMove = {
            selectedPiece: { i: posi, j: posj },
            destination: { i: tposi, j: tposj },
          };
        }
      } else {
        let ttposi = tposi + movesSet[i].i,
          ttposj = tposj + movesSet[i].j;
        if (isValid(ttposi, ttposj) && board[ttposi][ttposj] === 0) {
          board[posi][posj] = 0;
          board[ttposi][ttposj] = boardPiece;
          let tmp2 =
            ATTACK_POINTS +
            evaluatePosition({
              board,
              tposi: ttposi,
              tposj: ttposj,
              boardPiece,
            });
          if (board[tposi][tposj] === 3 || board[tposi][tposj] === 4)
            tmp2 += Math.floor(Math.random() * 4);
          board[posi][posj] = boardPiece;
          board[ttposi][ttposj] = 0;

          if (tmp2 > pieceValue) {
            pieceValue = tmp2;
            pieceMove = {
              selectedPiece: { i: posi, j: posj },
              destination: { i: ttposi, j: ttposj },
            };
          }
        }
      }
    }
  }
  return { value: pieceValue, pieceMove };
};

module.exports = ({ board, turn }) => {
  let bestMoveValue = -100,
    bestMove = null;
  for (let i = 0; i <= BOTTOM_ROW; ++i) {
    for (let j = 0; j <= BOTTOM_ROW; ++j) {
      if (board[i][j] === 0 || player[board[i][j]] !== turn) continue;
      const bestMoveForPiece = calculateBestPossibleMoves({
        board,
        posi: i,
        posj: j,
      });
      if (bestMoveForPiece.value > bestMoveValue) {
        bestMoveValue = bestMoveForPiece.value;
        bestMove = bestMoveForPiece.pieceMove;
      }
    }
  }
  console.log(bestMoveValue);
  console.log(bestMove);
  return bestMove;
};
