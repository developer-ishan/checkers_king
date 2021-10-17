const { endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("'quit-game' event called...");
    const endedGame = endGame({ player: socket });
    if (endedGame === null) return;
    const roomId = endedGame.id;
    io.to(roomId).emit("end-game");
    console.log("emitting 'end-game' event to room ", roomId);
    io.socketsLeave(roomId);
    sendGames(io);
  };
