const { endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("'quit-game' event called...");
    const roomId = endGame({ player: socket });
    io.to(roomId).emit("end-game");
    console.log("emitting 'end-game' event to room ", roomId);
    io.socketsLeave(roomId);
    sendGames(io);
  };
