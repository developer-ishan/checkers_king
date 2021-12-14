const {
  getGameByUserId,
} = require("../helpers/gameBoardHelpers/gamePlayManager");

// checking if the user already exists in another game
exports.userAlreadyExistsInOtherGame = async (socket, token) => {
  const existingGame = await getGameByUserId(token);

  if (existingGame !== undefined) {
    console.log("user already in an existing game... exiting!!");
    socket.emit("game-error", {
      title: "multiple game detected",
      msg: "You are already in a game as a player!! Kindly finish that first!!",
      buttonText: "okay",
      redirectTo: "/",
    });
  }
  return existingGame !== undefined;
};
