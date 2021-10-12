const { endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  () => {
    const roomId = endGame({ player: socket });
    socket.to(roomId).emit("end-game");
    sendGames(io);
  };
