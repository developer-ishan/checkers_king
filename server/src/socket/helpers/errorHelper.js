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

// helper to emit errors related to game
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

module.exports = { emitUserError, emitGameError };
