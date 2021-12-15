const {
  getGameByID,
  addPlayerToGame,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { sendGameStatus } = require("../../helpers/gameStatusHelper");
const {
  userAlreadyExistsInOtherGame,
  emitGameError,
} = require("../../helpers/errorHelper");
const {
  getGamePlayersWithGameId,
  rejoinGameWithGameId,
} = require("../../helpers/gameBoardHelpers/playerManager");

module.exports =
  ({ io, socket }) =>
  async (gameId, token) => {
    console.log("inside join game handler... trying to join game...");
    const alreadyExists = await userAlreadyExistsInOtherGame(socket, token);
    if (alreadyExists) {
      await rejoinGameWithGameId(socket, gameId, token);
      return;
    }

    console.log("existing game not found... joining game with id ", gameId);
    const game = getGameByID(gameId);
    if (game === undefined) {
      // emitting error in case the game with gameId isn't found
      emitGameError(
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
        gameId,
        token,
      });

      io.to(game.id).emit("players-info", getGamePlayersWithGameId(game));
      socket.emit("color", color);
    } else socket.emit("players-info", getGamePlayersWithGameId(game));

    sendGameStatus(io, gameId);
  };
