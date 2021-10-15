const { createNewGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  async (name, isBot, token) => {
    console.log("inside create game function...");
    const newGame = await createNewGame({ player: socket, name, isBot, token });
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
