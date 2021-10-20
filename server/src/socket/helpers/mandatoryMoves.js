const { getPossibleMoves } = require("./botHelpers");

const giveMandatoryMove = async ({ game, piece }) => {
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
