const { endGame, getColorOfPlayer } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

// user calling this function loses the game
module.exports =
  ({ io, socket }) =>
  async () => {
    console.log("'quit-game' event called...");
    const winner = getColorOfPlayer({ player: socket });
    console.log("winner of the game is ", winner);
    const endedGame = await endGame({ player: socket, winner });
    if (endedGame === null) return;

    const roomId = endedGame.id;
    io.to(roomId).emit("end-game");
    // removing all the users of this room
    io.socketsLeave(roomId);
    sendGames(io);
  };
