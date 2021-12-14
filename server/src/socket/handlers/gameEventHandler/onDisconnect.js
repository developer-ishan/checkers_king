const { endGame } = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { sendAllGames } = require("../../helpers/gameStatusHelper");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("user trying to disconnect ... ID : " + socket.id);
    const roomId = endGame({ player: socket });
    if (roomId != null) {
      console.log("user disconnecting is a player... ending game!!");
      socket.to(roomId).emit("end-game");
      sendAllGames(io);
    }
  };
