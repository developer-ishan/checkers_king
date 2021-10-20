const { getGameByUserId } = require("../gameManager");

// checking if the user already exists in another game
exports.userAlreadyExistsInOtherGame = async (socket, token) => {
  const existingGame = await getGameByUserId(token);
  if (existingGame !== undefined)
    socket.emit("game-error", {
      error:
        "You are already in a game as a player!! Kindly finish that first!!",
    });

  return existingGame !== undefined;
};
