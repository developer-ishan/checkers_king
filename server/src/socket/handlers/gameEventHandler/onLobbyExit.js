const {
  exitGuestLobby,
  exitUserLobby,
} = require("../../helpers/gameBoardHelpers/randomPlayManager");

module.exports =
  ({ io, socket }) =>
  async (token) => {
    console.log("exiting game lobby for user ");
    if (!token) return;

    if (token.startsWith("guest")) await exitGuestLobby(io, token);
    else await exitUserLobby(io, token);
  };
