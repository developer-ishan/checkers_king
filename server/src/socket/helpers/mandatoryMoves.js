const { getPossibleMoves } = require("./botHelpers");

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

const giveMandatoryMove = async ({ game, piece }) => {
  console.log("making the mandatory move...");
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

module.exports = { giveMandatoryMove };
