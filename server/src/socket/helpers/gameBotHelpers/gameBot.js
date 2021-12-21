const { performBotHeuristics } = require("./botHelpers");

// function to call the bot for move
exports.aiBotMove = ({ board, turn, level, mandatoryMoves }) => {
  console.log("ai_bot thinking of a clever move...");
  const maxPlayer = turn === "Red";

  const botMove = performBotHeuristics(board, level, maxPlayer, mandatoryMoves);
  return botMove.bestMove;
};
