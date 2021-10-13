const { endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("a user disconnected. ID :- ", socket.id);
    const roomId = endGame({ player: socket });
    if (!roomId) socket.to(roomId).emit("end-game");
    sendGames(io);
  };
