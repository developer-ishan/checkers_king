const { getGameByID, addPlayerToGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");
const { userAlreadyExistsInOtherGame } = require("../helpers/errorHelpers");

module.exports =
  ({ io, socket }) =>
  async (gameId, token) => {
    // checking if user already exists in another game
    const alreadyExists = await userAlreadyExistsInOtherGame(socket, token);
    if (alreadyExists) return;

    const game = getGameByID(gameId);
    // check for the validity of the gameId
    if (game === undefined) {
      socket.emit("game-error", { error: "Sorry! this game doesn't exist!!" });
      return;
    }

    socket.join(gameId);
    // if the players in the game are less than 2, user joins as opponent othewise as spectator
    if (game.players.length < 2) {
      const color = await addPlayerToGame({
        player: socket,
        gameId: gameId,
        token: token,
      });
      socket.emit("color", color);
    }
    sendGameStatus({ socket, gameId });
    sendGames(io);
  };
