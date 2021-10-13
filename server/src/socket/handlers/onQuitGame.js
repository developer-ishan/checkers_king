const { endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("'quit-game' event called...");
    const roomId = endGame({ player: socket });
    console.log("emitting 'end-game' event to room ", roomId);
    io.to(roomId).emit("end-game");
    sendGames(io);
  };
