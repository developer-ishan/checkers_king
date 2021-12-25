const { getOnlineFriends } = require("../userManager");
const emitMyInfoToFriends = async (io, socket, addedUser) => {
  const onlineFriends = await getOnlineFriends(addedUser.userId);
  onlineFriends.forEach((onlineFriend) => {
    io.to(onlineFriend.id).emit("friend-online", [
      {
        userId: addedUser.userId,
        username: addedUser.username,
        photo: addedUser.photo,
      },
    ]);
  });
  socket.emit(
    "friend-online",
    onlineFriends.map((o) => {
      return { userId: o.userId, username: o.username, photo: o.photo };
    })
  );
  /**
   * [{userId, username, photo}]
   */
};
module.exports = emitMyInfoToFriends;
