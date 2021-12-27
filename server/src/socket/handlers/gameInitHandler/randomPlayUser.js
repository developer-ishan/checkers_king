const {
  setInGameStatus,
} = require("../../helpers/gameBoardHelpers/playerManager");
const {
  randomPlayWithUser,
} = require("../../helpers/gameBoardHelpers/randomPlayManager");
const {
  sendGameStatus,
  sendAllGames,
} = require("../../helpers/gameStatusHelper");

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
      io,
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
      sendGameStatus(io, randomGame.id);
      const roomSocketCnt = io.sockets.adapter.rooms.get(gameId).size;
      io.to(gameId).emit("head-count", roomSocketCnt);

      sendAllGames(io);
      await setInGameStatus(io, randomGame);
    }
  };
