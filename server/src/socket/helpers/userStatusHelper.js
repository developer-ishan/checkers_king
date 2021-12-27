const { getGameByUserId } = require("./gameBoardHelpers/gamePlayManager");
const { getOnlineFriends, findOnlineUserById } = require("./userManager");

const sendUserStatus = async (io, userId) => {
  if (!userId || userId.startsWith("guest")) return;

  const onlineFriends = await getOnlineFriends(userId);
  const user = findOnlineUserById(userId);
  let game = null;
  if (user.status === "IN_GAME") game = getGameByUserId(userId);

  onlineFriends.forEach((friend) => {
    if (user.status === "IN_GAME") {
      io.to(friend.id).emit("user-status", {
        id: userId,
        status: user.status,
        gameId: game.id,
      });
    } else
      io.to(friend.id).emit("user-status", { id: userId, status: user.status });
  });
};

module.exports = { sendUserStatus };
