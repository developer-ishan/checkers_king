const {
  createNewGame,
  onMovePiece,
} = require("../../helpers/gameBoardHelpers/gamePlayManager");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");
const { aiBotMove } = require("../../helpers/gameBotHelpers/gameBot");
const { userAlreadyExistsInOtherGame } = require("../../helpers/errorHelper");

module.exports =
  ({ io, socket }) =>
  async (isBot, botLevel, color, mandatoryMoves, isRated, token) => {
    console.log("create new game event caught... checking for existing game!!");
    const alreadyExists = await userAlreadyExistsInOtherGame(socket, token);
    if (alreadyExists) return;

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
    // joining the room with name similar to the game id
    console.log(
      "sending game-status & joining respective room for " + newGame.id
    );

    socket.join(newGame.id);
    socket.emit("game-status", {
      id: newGame.id,
      board: newGame.board,
      turn: newGame.turn,
    });
    socket.emit("color", color);
    if (newGame.isBot) socket.emit("playing-with-bot", newGame.botLevel);
    else sendAllGames(io);

    /* ------------------------------------- Special Bot Condition ------------------------------------- */
    if (newGame.isBot && newGame.players[0].color === "Black") {
      // handles the condition when the game is against the bot & bot has to move first
      const nextMove = await aiBotMove({
        board: newGame.board,
        level: newGame.botLevel,
        turn: newGame.turn,
      });
      // next move is null if the bot doesn't have any possible moves, which is basically a win condition
      let botGame = onMovePiece({
        player: socket,
        selectedPiece: nextMove.selectedPiece,
        destination: nextMove.destination,
      });
      sendGameStatus({ socket, gameId: botGame.id });
    }
  };
