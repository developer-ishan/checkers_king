const emitOfflineInfoToFriends = require("../../helpers/friendEventHelpers/emitOfflineInfoToFriends");
const { removeUserFromList } = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  () => {
    const removedUser = removeUserFromList(socket.id);
    if (!removedUser.isGuest)
    emitOfflineInfoToFriends(io, socket, removedUser);
    console.log("User Disconnected :- " + socket.id);
  };
