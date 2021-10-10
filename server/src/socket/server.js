const createGame = require("./handlers/createGame");
const joinGame = require("./handlers/joinGame");

const sendGames = require("./helpers/sendGames");

exports.SocketServer = (io) => {
  console.log("socket server has started running...");

  io.on("connection", (socket) => {
    console.log("a user connected!");
    sendGames(socket);

    socket.on("create-game", createGame({ io, socket }));

    socket.on("join-game", joinGame({ io, socket }));

    socket.on("disconnect", () => {
      console.log("a user disconnected!");
    });
  });
};
