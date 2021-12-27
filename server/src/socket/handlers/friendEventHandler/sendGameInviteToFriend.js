const { isUserAlreadyInGame, isUserAlreadyInGameUserId } = require("../../helpers/gameBoardHelpers/playerManager");
const {
  getUserDetailsWithToken,
  findOnlineUserById,
} = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  async ({ gameOptions, token, friend }, callback) => {
    const existingGameId = await isUserAlreadyInGame(token);
    const existingGameIdFriend = await isUserAlreadyInGameUserId(friend.userId);
    if (existingGameId) {
      callback({ success: false, msg: "you are already in game" });
      return;
    }
    if (existingGameIdFriend) {
      callback({ success: false, msg: "Friend already in game" });
      return;
    }
    const user = await getUserDetailsWithToken(token);
    if (user && !user.isGuest) {
      const friendSock = findOnlineUserById(friend.userId);
      if (!friendSock) {
        callback({ online: false, msg: "user isoffline", success: false });
        return;
      }
      console.log(
        `got game invite for ${friendSock.username} by ${user.username}`,
        {
          gameOptions,
          friend,
        }
      );
      console.log(friendSock.id);
      if (gameOptions.checker === "Red") gameOptions.checker = "Black";
      else gameOptions.checker = "Red";
      io.to(friendSock.id).emit("friend-game-invite-receive", {
        gameOptions,
        invitedBy: {
          username: user.username,
          userId: user.userId,
          photo: user.photo,
        },
      });
      callback({ username: friend.username, online: true, success: true });
    } else {
      console.log("Guest or invalid user");
      callback({ online: false, msg: "Guest or invalid user", success: false });
    }
  };
