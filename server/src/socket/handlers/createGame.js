const { createNewGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  async (name, isBot, mandatoryMoves, token) => {
    console.log("inside create game function...");
    console.log({ name, isBot, token, mandatoryMoves });
    const newGame = await createNewGame({
      player: socket,
      name,
      isBot,
      mandatoryMoves,
      token,
    });
    console.log(newGame.id);
    socket.join(newGame.id);
    sendGames(io);
    socket.emit("game-status", {
      id: newGame.id,
      board: newGame.board,
      turn: newGame.turn,
    });
    socket.emit("color", "Red");
  };
