const { getOnlineFriends } = require("../userManager");
const emitMyInfoToFriends = async (io, socket, addedUser) => {
  const onlineFriends = await getOnlineFriends(addedUser.userId);
  onlineFriends.forEach((onlineFriend) => {
    io.to(onlineFriend.id).emit("friend-online", [
      {
        _id: addedUser.userId,
        username: addedUser.username,
        photo: addedUser.photo,
      },
    ]);
  });
  socket.emit("friend-online", onlineFriends);
  /**
   * [{_id, username, photo}]
  */
};
module.exports = emitMyInfoToFriends;