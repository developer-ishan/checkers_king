const RED_PAWN = 1;
const BLACK_PAWN = 2;
const RED_QUEEN = 3;
const BLACK_QUEEN = 4;

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

const isValid = (x, y) => {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
};

module.exports = ({ game, selectedPiece }) => {
  console.log("inside mandatory moves function...");
  console.log(selectedPiece);

  const i = selectedPiece.i,
    j = selectedPiece.j;
  const boardPiece = game.board[i][j];
  let res = false;
  console.log({ i, j, boardPiece });
  console.log(playerMoves[boardPiece]);
  for (let itr = 0; itr < playerMoves[boardPiece].length; ++itr) {
    let ti = i + playerMoves[boardPiece][itr].i,
      tj = j + playerMoves[boardPiece][itr].j;
    console.log({ ti, tj });
    if (isValid(ti, tj) && player[boardPiece] !== player[game.board[ti][tj]]) {
      if (game.board[ti][tj] === 0) continue;
      let tti = ti + playerMoves[boardPiece][itr].i,
        ttj = tj + playerMoves[boardPiece][itr].j;
      console.log({ tti, ttj });
      if (isValid(tti, ttj) && game.board[tti][ttj] === 0) {
        res = { i: tti, j: ttj };
        break;
      }
    }
  }
  console.log("returning from mandatory moves function... ", res);
  return res;
};
