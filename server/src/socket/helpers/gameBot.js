const { ai_algorithm } = require("./botHelpers");

exports.aiBotMove = ({ board, turn, level }) => {
  const maxPlayer = turn === "Red";
  return ai_algorithm(board, level, maxPlayer).bestMove;
};
