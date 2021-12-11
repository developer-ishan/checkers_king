const { createNewGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");
const { aiBotMove } = require("../helpers/gameBot");
const { movePiece } = require("../gameManager");
const { userAlreadyExistsInOtherGame } = require("../helpers/errorHelpers");

module.exports =
  ({ io, socket }) =>
  async (isBot, botLevel, color, mandatoryMoves, isRated, token) => {
    // checking if user already exists in another game
    console.log("create game called");
    const alreadyExists = await userAlreadyExistsInOtherGame(socket, token);
    if (alreadyExists) return;
    console.log("not already exist");

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
    socket.join(newGame.id);
    sendGames(io);
    socket.emit("game-status", {
      id: newGame.id,
      board: newGame.board,
      turn: newGame.turn,
    });
    socket.emit("color", color);
    //if playing with bot send this
    if (newGame.isBot) socket.emit("playing-with-bot", newGame.botLevel);

    // handles the condition when the game is against the bot & bot has to move first
    if (newGame.isBot && newGame.players[0].color === "Black") {
      const nextMove = aiBotMove({
        board: newGame.board,
        level: newGame.botLevel,
        turn: newGame.turn,
      });
      // delay for move visiblity
      const delay = newGame.botLevel === 6 ? 200 : 300;
      await new Promise((resolve) => setTimeout(resolve, delay));
      // next move is null if the bot doesn't have any possible moves, which is basically a win condition

      let botGame = movePiece({
        player: socket,
        selectedPiece: nextMove.selectedPiece,
        destination: nextMove.destination,
      });
      sendGameStatus({ socket, gameId: botGame.id });
    }
  };
