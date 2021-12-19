const {
  exitGuestLobby,
  exitUserLobby,
} = require("../../helpers/gameBoardHelpers/randomPlayManager");

module.exports =
  ({ io, socket }) =>
  (token) => {
    console.log("exiting game lobby for user ");
    if (!token) return;

    if (token.startsWith("guest")) exitGuestLobby(token);
    else exitUserLobby(token);
  };
