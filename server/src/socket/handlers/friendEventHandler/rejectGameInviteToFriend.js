const { getUserDetailsWithToken, findOnlineUserById } = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  async ({ token, friend }) => {
    const userDoc = await getUserDetailsWithToken(token);
    if (userDoc && !userDoc.isGuest) {
      const f = findOnlineUserById(friend.userId);
      if (f) {
        io.to(f.id).emit("friend-game-invite-rejected", userDoc.username);
      }
    } else {
      console.log("Guest or invalid user");
    }
  };
