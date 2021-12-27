const {
  getUserDetailsWithToken,
  findOnlineUserById,
} = require("../../helpers/userManager");
const {
  createNewGame,
  onMovePiece,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");
const {
  userAlreadyExistsInOtherGame,
  emitGameError,
  emitUserError,
} = require("../../helpers/errorHelper");
const {
  isUserAlreadyInGame,
  getGamePlayersWithGameId,
  isUserAlreadyInGameUserId,
} = require("../../helpers/gameBoardHelpers/playerManager");

module.exports =
  ({ io, socket }) =>
  async ({ color, mandatoryMoves, isRated, token, friend }, callback) => {
    console.log("accepting game invite");
    /* -------------------------------------- Checking For Existing Game -------------------------------------- */
    console.log("create new game event caught... checking for existing game!!");
    const existingGameId = await isUserAlreadyInGame(token);
    const existingGameIdFriend = await isUserAlreadyInGameUserId(friend.userId);
    const f = findOnlineUserById(friend.userId);

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
    if (existingGameIdFriend) {
      emitUserError(
        socket,
        "Friend has already started another game !",
        "Attention! Player is already in an existing game! Kindly let him finish that first!!",
        "Okay",
        "/"
      );
      return;
    }
    if(!f){
      emitUserError(
        socket,
        "Friend has gone offline !",
        "You were too late to accept his invite",
        "Okay",
        "/"
      );
      return;
    }
    /* -------------------------------------- Checking For Existing Game -------------------------------------- */

    console.log("existing game not found... creating a new game!!");
    const newGame = await createNewGame({
      player: socket,
      isBot: false,
      botLevel:-1,
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

    //TODO:check for number of players in the game
    // after creation of game
    //first player wait for the opponent
    socket.emit("opponent-status", {
      title: "waiting for opponent",
      msg: "wait for opponent to join the game",
      buttonText: "exit game",
      redirectTo: "/",
    });
    io.to(f.id).emit("friend-game-invite-accepted", newGame.id);
    sendAllGames(io);
  };
