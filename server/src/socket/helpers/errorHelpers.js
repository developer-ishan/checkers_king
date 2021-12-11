const { getGameByUserId } = require("../gameManager");

// checking if the user already exists in another game
exports.userAlreadyExistsInOtherGame = async (socket, token) => {
  console.log("checking existance");
  const existingGame = await getGameByUserId(token);
  console.log("exisiting game:", existingGame);
  if (existingGame !== undefined) {
    console.log("ghapla h");
    socket.emit("game-error", {
      title: "multiple game detected",
      msg: "You are already in a game as a player!! Kindly finish that first!!",
      buttonText: "okay",
      redirectTo: "/",
    });
  }
  return existingGame !== undefined;
};
