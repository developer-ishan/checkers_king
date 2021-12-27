const emitOfflineInfoToFriends = require("../../helpers/friendEventHelpers/emitOfflineInfoToFriends");
const { removeUserFromList } = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("User Disconnected :- " + socket.id);
    const removedUser = removeUserFromList(socket.id);
    if (!removedUser) return;
    if (!removedUser.isGuest) emitOfflineInfoToFriends(io, socket, removedUser);
  };
