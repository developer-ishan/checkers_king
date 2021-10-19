const { createNewGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");
const { aiBotMove } = require("../helpers/gameBot");
const { movePiece } = require("../gameManager");

module.exports =
  ({ io, socket }) =>
  async (isBot, botLevel, color, mandatoryMoves, token) => {
    console.log("inside create game function...");
    const newGame = await createNewGame({
      player: socket,
      isBot,
      botLevel,
      color,
      mandatoryMoves,
      token,
    });
    socket.join(newGame.id);
    sendGames(io);
    socket.emit("game-status", {
      id: newGame.id,
      board: newGame.board,
      turn: newGame.turn,
    });
    socket.emit("color", color);

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
