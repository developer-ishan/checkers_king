const { ai_algorithm } = require("./botHelpers");

exports.aiBotMove = ({ board, turn, level, mandatoryMoves }) => {
  console.log("ai_bot thinking of a clever move...");
  console.log(board, turn, level, mandatoryMoves);
  const maxPlayer = turn === "Red";

  const aiBotMove = ai_algorithm(board, level, maxPlayer, mandatoryMoves);
  return aiBotMove.bestMove;
};
