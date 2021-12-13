/* Game Initiation Handler Declarations */
const createNewGame = require("./handlers/gameInitHandler/createNewGame");
const joinGameBoard = require("./handlers/gameInitHandler/joinGameBoard");
const randomPlayGuest = require("./handlers/gameInitHandler/randomPlayGuest");
const randomPlayUser = require("./handlers/gameInitHandler/randomPlayUser");

/* Game Event Handler Declarations */
/*  -- Game Chat Handler Declarations */
const sendUserMessage = require("./handlers/gameEventHandler/gameChatHandler/sendUserMessage");
const userVideoHandler = require("./handlers/gameEventHandler/gameChatHandler/userVideoHandler");

/*  -- Game Draw Handler Declarations */
const acceptDraw = require("./handlers/gameEventHandler/gameDrawHandler/acceptDraw");
const offerDraw = require("./handlers/gameEventHandler/gameDrawHandler/offerDraw");
const rejectDraw = require("./handlers/gameEventHandler/gameDrawHandler/rejectDraw");

const onMovePiece = require("./handlers/gameEventHandler/onMovePiece");
const onDisconnect = require("./handlers/gameEventHandler/onDisconnect");
const onQuitGame = require("./handlers/gameEventHandler/onQuitGame");

/* Miscellaneous Declarations */
const { sendAllGames } = require("./helpers/gameStatusHelper");

exports.SocketServer = (io) => {
  console.log("socket server has started running...");
  sendAllGames(io);

  // on a new user socket connection
  io.on("connection", (socket) => {
    console.log("a user connected! ID :- " + socket.id);

    /* game initiation handler calls BEGIN */
    socket.on("create-game", createNewGame({ io, socket }));
    socket.on("join-game", joinGameBoard({ io, socket }));
    socket.on("random-play-guest", randomPlayGuest({ io, socket }));
    socket.on("random-play-user", randomPlayUser({ io, socket }));
    /* game initiation handler calls END */

    /* game event handler calls BEGIN */
    /*  -- game chats handler calls BEGIN */
    socket.on("send-msg", ({ gameId, msg }) => {
      sendUserMessage({ gameId, msg, io, socket });
    });

    socket.on("opponent-video-ready", ({ peerId, gameId }) => {
      userVideoHandler({ peerId, gameId, io });
    });
    /*  -- game chats handler calls END */

    /*  -- game draw handler calls BEGIN */
    socket.on("draw-accepted", ({ gameId }) => {
      acceptDraw({ gameId, io, socket });
    });

    socket.on("draw-offered", ({ gameId }) => {
      offerDraw({ gameId, io, socket });
    });

    socket.on("draw-rejected", ({ gameId }) => {
      rejectDraw({ gameId, io, socket });
    });
    /*  -- game draw handler calls END */

    socket.on("disconnect", onDisconnect({ io, socket }));
    socket.on("move-piece", onMovePiece({ io, socket }));
    socket.on("quit-game", onQuitGame({ io, socket }));
    /* game event handler calls END */

    /* miscellaneous event handlers */
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
    });
  });
};
