const { randomPlayWithUser } = require("../randomManager");
const sendGames = require("../helpers/sendGames");
const sendGameStatus = require("../helpers/sendGameStatus");

// joins the socket into the room with id roomId
const joinRoom = (socket, roomId) => {
  console.log("socket id : - ", socket.id);
  console.log("calling joinRoom function to join :- ", roomId);
  socket.join(roomId);
};

module.exports =
  ({ io, socket }) =>
  async (mandatoryMoves, token) => {
    const randomGame = await randomPlayWithUser({
      player: socket,
      token,
      mandatoryMoves,
    });

    if (randomGame !== null) {
      // emitting the details to appropriate players
      for (let i = 0; i < randomGame.players.length; ++i) {
        let player = randomGame.players[i];
        joinRoom(player.socket, randomGame.id);
        player.socket.emit("color", player.color);
      }
      // sending the game status to appropriate clients
      sendGameStatus({ socket, gameId: randomGame.id });
      sendGames(io);
    }
  };
