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
const onLobbyExit = require("./handlers/gameEventHandler/onLobbyExit");
const { sendAllGames } = require("./helpers/gameStatusHelper");
const { addUserToList } = require("./helpers/userManager");
const { emitUserError } = require("./helpers/errorHelper");
const {
  isUserAlreadyInGame,
  getGameWithGameId,
} = require("./helpers/gameBoardHelpers/playerManager");
const sendFriendRequest = require("./handlers/friendEventHandler/sendFriendRequest");
const respondFriendRequest = require("./handlers/friendEventHandler/respondFriendRequest");
const emitMyInfoToFriends = require("./helpers/friendEventHelpers/emitMyInfoToFriends");
const sendGameInviteToFriend = require("./handlers/friendEventHandler/sendGameInviteToFriend");
const acceptGameInviteToFriend = require("./handlers/friendEventHandler/acceptGameInviteToFriend");
const rejectGameInviteToFriend = require("./handlers/friendEventHandler/rejectGameInviteToFriend");

exports.SocketServer = (io) => {
  console.log("socket server has started running...");

  // on a new user socket connection
  io.on("connection", async (socket) => {
    console.log("a user connected! ID :- " + socket.id);
    socket.on("disconnect", onDisconnect({ io, socket }));

    /* ---------------------------------- Check For Multiple Devices ----------------------------------*/
    const addedUser = await addUserToList(socket, socket.handshake.query.token);
    if (addedUser === false) {
      console.log("User already online... disconnecting!!");
      emitUserError(
        socket,
        "Multiple Devices/tabs Detected!!",
        "Attention! you can connect 1 device only, close all other connections & retry!!",
        "Close",
        ""
      );
      socket.disconnect();
    } else if (!addedUser) {
      emitUserError(
        socket,
        "Invalid Credentials!!",
        "You existance is invalid!!",
        "Close",
        "/"
      );
    } else {
      if (!addedUser.isGuest) await emitMyInfoToFriends(io, socket, addedUser);
    }
    /* ---------------------------------- Check For Multiple Devices ----------------------------------*/

    /* ---------------------------------- Check For Existing Games ----------------------------------*/
    const existingGameID = await isUserAlreadyInGame(
      socket.handshake.query.token
    );
    if (existingGameID) {
      const game = getGameWithGameId(existingGameID);
      console.log("existing game found... sending to user...");
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
    socket.on(
      "friend-game-invite-send",
      sendGameInviteToFriend({ io, socket })
    );
    //also emit "friend-game-invite-receive"
    socket.on(
      "friend-game-invite-accept",
      acceptGameInviteToFriend({ io, socket })
    );
    socket.on(
      "friend-game-invite-reject",
      rejectGameInviteToFriend({ io, socket })
    );

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

    socket.on("move-piece", onMovePiece({ io, socket }));
    socket.on("quit-game", onQuitGame({ io, socket }));
    /* game event handler calls END */

    /* miscellaneous event handlers */
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      // sending the person count in the room
      io.to(roomId).emit(
        "head-count",
        io.sockets.adapter.rooms.get(roomId).size
      );
    });
    socket.on("exit-game-lobby", onLobbyExit({ io, socket }));
  });
};
