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
const { addUserToList } = require("./helpers/userManager");
const { emitUserError } = require("./helpers/errorHelper");
const {
  isUserAlreadyInGame,
  getGameWithGameId,
} = require("./helpers/gameBoardHelpers/playerManager");
const sendFriendRequest = require("./handlers/friendEventHandler/sendFriendRequest");
const respondFriendRequest = require("./handlers/friendEventHandler/respondFriendRequest");

exports.SocketServer = (io) => {
  console.log("socket server has started running...");

  // on a new user socket connection
  io.on("connection", async (socket) => {
    console.log("a user connected! ID :- " + socket.id);

    /* ---------------------------------- Check For Multiple Devices ----------------------------------*/
    const addedUser = await addUserToList(socket, socket.handshake.query.token);
    if (!addedUser) {
      console.log("User already online... disconnecting!!");
      emitUserError(
        socket,
        "Multiple Devices Detected!!",
        "Attention! currently connected with > 1 device, close all other connections & retry!!",
        "Close",
        ""
      );
      socket.disconnect();
    }
    /* ---------------------------------- Check For Multiple Devices ----------------------------------*/

    /* ---------------------------------- Check For Existing Games ----------------------------------*/
    const existingGameID = await isUserAlreadyInGame(
      socket.handshake.query.token
    );
    if (existingGameID) {
      const game = getGameWithGameId(existingGameID);
      console.log("existing game found... sending to user...");
      console.log(game);
      socket.emit("ongoing-game", game);
    }
    /* ---------------------------------- Check For Existing Games----------------------------------*/

    sendAllGames(io);

    /* game initiation handler calls BEGIN */
    socket.on("create-game", createNewGame({ io, socket }));
    socket.on("join-game", joinGameBoard({ io, socket }));
    socket.on("random-play-guest", randomPlayGuest({ io, socket }));
    socket.on("random-play-user", randomPlayUser({ io, socket }));
    /* game initiation handler calls END */

    /* Friend requests*/
    socket.on("send-friend-request", sendFriendRequest({ io, socket }));
    socket.on("respond-friend-request", respondFriendRequest({ io, socket }));

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
