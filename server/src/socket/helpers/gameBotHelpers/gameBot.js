const { ai_algorithm } = require("./botHelpers");

exports.aiBotMove = async ({ board, turn, level }) => {
  console.log("ai_bot thinking of a clever move...");
  const maxPlayer = turn === "Red";

  // performing delay to maintain piece move visibility
  // const timeDelay = level === 6 ? 200 : 300;
  // await new Promise((resolve) => setTimeout(resolve, timeDelay));

  const aiBotMove = ai_algorithm(board, level, maxPlayer);
  return aiBotMove.bestMove;
};
