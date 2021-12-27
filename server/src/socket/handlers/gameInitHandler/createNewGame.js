const {
  createNewGame,
  onMovePiece,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");
const { aiBotMove } = require("../../helpers/gameBotHelpers/gameBot");
const { emitGameError, emitUserError } = require("../../helpers/errorHelper");
const { findOnlineUserByToken } = require("../../helpers/userManager");
const {
  isUserAlreadyInGame,
  getGamePlayersWithGameId,
} = require("../../helpers/gameBoardHelpers/playerManager");
const { sendUserStatus } = require("../../helpers/userStatusHelper");

module.exports =
  ({ io, socket }) =>
  async (isBot, botLevel, color, mandatoryMoves, isRated, token) => {
    /* -------------------------------------- Checking For Existing Game -------------------------------------- */
    console.log("create new game event caught... checking for existing game!!");
    const existingGameId = await isUserAlreadyInGame(token);

    if (existingGameId) {
      emitUserError(
        socket,
        "Multiple Game Detected !",
        "Attention! you are already in an existing game! Kindly finish that first!!",
        "Okay",
        "/"
      );
      return;
    }
    /* -------------------------------------- Checking For Existing Game -------------------------------------- */

    console.log("existing game not found... creating a new game!!");
    const newGame = await createNewGame({
      player: socket,
      isBot,
      botLevel,
      color,
      mandatoryMoves,
      isRated,
      token,
    });

    if (!newGame) {
      emitGameError(
        socket,
        "Create Game Error!",
        "Sorry! we couldn't create a new game. Try again in a few moments!",
        "Okay",
        "/"
      );
      return;
    }
    // joining the room with name similar to the game id
    socket.join(newGame.id);
    socket.emit("game-status", {
      id: newGame.id,
      board: newGame.board,
      turn: newGame.turn,
    });
    socket.emit("color", color);
    socket.emit("head-count", 1);
    const user = findOnlineUserByToken(token);
    if (isBot) user.status = "IN_GAME";
    else user.status = "IN_LOBBY";
    await sendUserStatus(io, user.userId);

    if (newGame.isBot) {
      socket.emit("playing-with-bot", newGame.botLevel);
      socket.emit("players-info", getGamePlayersWithGameId(newGame));
    } else {
      //TODO:check for number of players in the game
      // after creation of game
      //first player wait for the opponent
      socket.emit("opponent-status", {
        title: "waiting for opponent",
        msg: "wait for opponent to join the game",
        buttonText: "exit game",
        redirectTo: "/",
      });
      sendAllGames(io);
    }

    /* ------------------------------------- Special Bot Condition ------------------------------------- */
    if (newGame.isBot && newGame.players[0].color === "Black") {
      // handles the condition when the game is against the bot & bot has to move first
      const nextMove = aiBotMove({
        board: newGame.board,
        level: newGame.botLevel,
        turn: newGame.turn,
        mandatoryMoves: newGame.mandatoryMoves,
      });
      // next move is null if the bot doesn't have any possible moves, which is basically a win condition
      let botGame = await onMovePiece({
        player: socket,
        selectedPiece: nextMove.selectedPiece,
        destination: nextMove.destination,
      });
      sendGameStatus(io, botGame.id);
    }
    /* ------------------------------------- Special Bot Condition ------------------------------------- */
  };
