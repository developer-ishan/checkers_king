const {
  getGameByID,
  addPlayerToGame,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { sendGameStatus } = require("../../helpers/gameStatusHelper");
const {
  userAlreadyExistsInOtherGame,
  emitUserError,
} = require("../../helpers/errorHelper");

module.exports =
  ({ io, socket }) =>
  async (gameId, token) => {
    console.log("inside join game handler... trying to join game...");
    const alreadyExists = await userAlreadyExistsInOtherGame(socket, token);
    if (alreadyExists) return;

    console.log("existing game not found... joining game with id ", gameId);
    const game = getGameByID(gameId);
    if (game === undefined) {
      // emitting error in case the game with gameId isn't found
      emitUserError(
        socket,
        "Invalid Game !",
        "Sorry! this game doesn't exist!!",
        "Okay",
        "/"
      );
      return;
    }

    console.log("game exists... joining room!!");
    socket.join(gameId);
    if (game.players.length < 2) {
      // if the players < 2, user joins as opponent, othewise as spectator
      console.log("joining game as opponent...");
      const color = await addPlayerToGame({
        player: socket,
        gameId: gameId,
        token: token,
      });
      socket.emit("color", color);
    }
    sendGameStatus(io, gameId);
  };
