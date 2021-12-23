const emitMyInfoToFriends = async (io, socket, addedUser) => {
  const friends = await getOnlineFriends(addedUser.userId);
  friends.forEach((friend) => {
    io.to(friend.id).emit("friend-online", [
      {
        _id: addedUser.userId,
        username: addedUser.username,
        photo: addedUser.photo,
      },
    ]);
    socket.emit(
      "friend-online",
      friends.map((friend) => {
        return {
          _id: friend.userId,
          username: friend.username,
          photo: friend.photo,
        };
      })
    );
  });
};
