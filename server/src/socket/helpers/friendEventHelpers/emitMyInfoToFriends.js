const { getOnlineFriends } = require("../userManager");

const emitMyInfoToFriends = async (io, socket, addedUser) => {
  const onlineFriends = await getOnlineFriends(addedUser.userId);
  onlineFriends.forEach((onlineFriend) => {
    if (onlineFriend)
      io.to(onlineFriend.id).emit("friend-online", [
        {
          userId: addedUser.userId,
          username: addedUser.username,
          status: addedUser.status,
          photo: addedUser.photo,
        },
      ]);
  });

  socket.emit(
    "friend-online",
    onlineFriends.map((o) => {
      return {
        userId: o.userId,
        username: o.username,
        photo: o.photo,
        status: o.status,
      };
    })
  );
  /**
   * [{userId, username, photo}]
   */
};
module.exports = emitMyInfoToFriends;
