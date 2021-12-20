module.exports =
  ({ io, socket }) =>
  async (token, senderId, response) => {
    var decodedId = jwt.verify(token, JWT_SECRET).sub;
    const myInfo = await User.findById(decodedId);
    if (myInfo && myInfo.friends) {
      for (var i = 0; i < myInfo.friends.length; i++) {
        if (myInfo.friends[i].user == senderId) {
          myInfo.friends[i].status = response;
          await myInfo.save();
          const sender = await findOnlineUserById(senderId);
          if (sender)
            io.to(sender.id).emit("ack-friend-request", {
              userId: myInfo._id,
              username: myInfo.username,
              photo: filterPhoto(myInfo)
            });
          return;
        }
      }
    }
  };
