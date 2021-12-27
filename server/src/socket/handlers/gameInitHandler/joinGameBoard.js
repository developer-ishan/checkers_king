const {
  getGameByID,
  addPlayerToGame,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { sendGameStatus } = require("../../helpers/gameStatusHelper");
const { emitGameError, emitUserError } = require("../../helpers/errorHelper");
const {
  getGamePlayersWithGameId,
  rejoinGameWithGameId,
  isUserAlreadyInGame,
  setInGameStatus,
} = require("../../helpers/gameBoardHelpers/playerManager");

module.exports =
  ({ io, socket }) =>
  async (gameId, token) => {
    console.log("inside join game handler... trying to join game...");
    const existingGameId = await isUserAlreadyInGame(token);
    if (existingGameId) {
      await rejoinGameWithGameId(io, socket, existingGameId, token);
      return;
    }

    if (existingGameId && existingGameId !== gameId) {
      emitUserError(
        socket,
        "Multiple Game Detected !",
        "Attention! you are already in an existing game! Kindly finish that first!!",
        "Okay",
        "/"
      );
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
    if (!game.isBot && game.players.length < 2) {
      // if the players < 2, user joins as opponent, othewise as spectator
      console.log("joining game as opponent...");
      const color = await addPlayerToGame({
        player: socket,
        gameId,
        token,
      });

      io.to(game.id).emit("players-info", getGamePlayersWithGameId(game));
      socket.emit("color", color);
      socket.to(gameId).emit("opponent-status", "ready");
      await setInGameStatus(io, game);
    } else socket.emit("players-info", getGamePlayersWithGameId(game));

    const roomSocketCnt = io.sockets.adapter.rooms.get(game.id).size;
    io.to(game.id).emit("head-count", roomSocketCnt);
    sendGameStatus(io, gameId);
  };
