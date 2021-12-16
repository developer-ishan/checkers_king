const {
  getGameByUserId,
} = require("../helpers/gameBoardHelpers/gamePlayManager");

// helper to emit respective error to the user
const emitUserError = (
  socket,
  errorTitle,
  errorDesc,
  errorBtn,
  redirectUrl
) => {
  socket.emit("user-error", {
    title: errorTitle,
    msg: errorDesc,
    buttonText: errorBtn,
    redirectTo: redirectUrl,
  });
};

const emitGameError = (
  socket,
  errorTitle,
  errorDesc,
  errorBtn,
  redirectUrl
) => {
  socket.emit("game-error", {
    title: errorTitle,
    msg: errorDesc,
    buttonText: errorBtn,
    redirectTo: redirectUrl,
  });
};

// checking if the user already exists in another game
const userAlreadyExistsInOtherGame = async (socket, token) => {
  const existingGame = await getGameByUserId(token);

  if (existingGame !== undefined) {
    console.log("user already in an existing game... throwing error");
    emitUserError(
      socket,
      "Multiple Game Detected !",
      "Attention! you are already in an existing game! Kindly finish that first!!",
      "Okay",
      "/"
    );
  }
  return existingGame !== undefined;
};

module.exports = { emitUserError, emitGameError, userAlreadyExistsInOtherGame };
