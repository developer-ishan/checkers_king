const { ai_algorithm } = require("./botHelpers");

exports.aiBotMove = ({ board, turn, level }) => {
  // TODO: setting the difficulty level of the bot
  console.log("inside aiBotMove function...");
  console.log("turn : ", turn);
  console.log("level : ", level);
  const maxPlayer = turn === "Red";
  return ai_algorithm(board, level, maxPlayer).bestMove;
};
