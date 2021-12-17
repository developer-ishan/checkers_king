const { endGame } = require("../../helpers/gameBoardHelpers/gamePlayManager");
const { sendAllGames } = require("../../helpers/gameStatusHelper");
const { removeUserFromList } = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  () => {
    removeUserFromList(socket.id);
    console.log("User Disconnected :- " + socket.id);
    // const roomId = endGame({ player: socket });
    // if (roomId != null) {
    //   socket.to(roomId).emit("end-game");
    //   sendAllGames(io);
    // }
  };
