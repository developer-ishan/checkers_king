const { endGame } = require("../gameManager");
const sendGames = require("../helpers/sendGames");

module.exports =
  ({ io, socket }) =>
  () => {
    console.log("a user disconnected!");
    endGame({ player: socket });
    sendGames(io);
  };
