const { getOnlineFriends } = require("../userManager");

const emitOfflineInfoToFriends = async (io, socket, removedUser) => {
  const onlineFriends = await getOnlineFriends(removedUser.userId);
  onlineFriends.forEach((onlineFriend) => {
    if (onlineFriend)
      io.to(onlineFriend.id).emit("friend-offline", {
        userId: removedUser.userId,
        username: removedUser.username,
        photo: removedUser.photo,
      });
  });
  /**
   * [{userId, username, photo}]
   */
};
module.exports = emitOfflineInfoToFriends;
