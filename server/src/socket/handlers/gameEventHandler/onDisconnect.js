const { removeUserFromList } = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  () => {
    removeUserFromList(socket.id);
    console.log("User Disconnected :- " + socket.id);
  };
