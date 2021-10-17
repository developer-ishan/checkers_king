const { ai_algorithm } = require("./botHelpers");

exports.aiBotMove = ({ board, turn }) => {
  // TODO: setting the difficulty level of the bot
  console.log("inside aiBotMove function...");
  const maxPlayer = turn === "Red";
  return ai_algorithm(board, 3, maxPlayer).bestMove;
};
