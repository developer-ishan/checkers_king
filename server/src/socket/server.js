const createGame = require("./handlers/createGame");
const joinGame = require("./handlers/joinGame");
const movePiece = require("./handlers/onMovePiece");
const onDisconnect = require("./handlers/onDisconnect");
const onQuitGame = require("./handlers/onQuitGame");

const sendGames = require("./helpers/sendGames");
const saveChat = require("./handlers/saveChat");
const offerDraw = require("./handlers/offerDraw");
const rejectDraw = require("./handlers/rejectDraw");
const acceptDraw = require("./handlers/acceptDraw");

exports.SocketServer = (io) => {
  console.log("socket server has started running...");

  io.on("connection", (socket) => {
    console.log("a user connected! ID :- " + socket.id);
    sendGames(socket);

    socket.on("create-game", createGame({ io, socket }));

    socket.on("join-game", joinGame({ io, socket }));

    socket.on("move-piece", movePiece({ io, socket }));

    socket.on("quit-game", onQuitGame({ io, socket }));

    socket.on("draw-offered", ({ gameId }) => {
      offerDraw({ gameId, io, socket });
    });

    socket.on("draw-rejected", ({ gameId }) => {
      rejectDraw({ gameId, io, socket });
    });
    socket.on("draw-accepted", ({ gameId }) => {
      acceptDraw({ gameId, io, socket });
    });
    socket.on("leave-room", ({ roomId }) => {
      console.log("caught leave room ", roomId);
      socket.leave(roomId);
    });

    socket.on("send-msg", ({ gameId, msg }) => {
      saveChat({ gameId, msg, io, socket });
    });
    // socket.on("send-msg", saveChat({ io, socket }));
    socket.on("disconnect", onDisconnect({ io, socket }));
  });
};
