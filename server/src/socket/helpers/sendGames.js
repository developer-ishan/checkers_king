const { getGames } = require("../gameManager");

module.exports = (io) => {
  io.emit("games", getGames());
};
