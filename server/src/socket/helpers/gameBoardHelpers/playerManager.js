const { getGamesList, getGameByID } = require("./gamePlayManager");
const { getUserDetailsWithToken } = require("../userManager");

const findPlayersWithID = (playerId) => {
  const games = getGamesList();
  return games.find((game) => {
    return game.players.find((player) => player.id === playerId);
  });
};

const getGamePlayersWithGameId = (game) => {
  let players = [];
  game.players.map((player) =>
    players.push({
      id: player.id,
      color: player.color,
      username: player.username,
      photo: player.photo,
    })
  );
  return players;
};

const getGameWithGameId = (gameId) => {
  const game = getGameByID(gameId);
  let players = getGamePlayersWithGameId(game);
  return { id: game.id, turn: game.turn, players };
};

const isUserAlreadyInGame = async (token) => {
  const userDetails = await getUserDetailsWithToken(token);
  const userGame = findPlayersWithID(userDetails.userId);
  if (userGame) return userGame.id;
  return userGame;
};

const rejoinGameWithGameId = async (socket, gameId, token) => {
  const existingGame = await isUserAlreadyInGame(token);
  const userDetails = await getUserDetailsWithToken(token);
  let socketPlayer = null;

  if (existingGame !== gameId) return;
  const game = getGameByID(gameId);
  game.players.map((player) => {
    if (player.id === userDetails.userId) {
      player.socket = socket;
      socketPlayer = player;
    }
  });
  socket.emit("color", socketPlayer.color);
  socket.emit("players-info", getGamePlayersWithGameId(game));
  socket.emit("game-status", {
    id: game.id,
    board: game.board,
    turn: game.turn,
  });
};

module.exports = {
  isUserAlreadyInGame,
  getGamePlayersWithGameId,
  getGameWithGameId,
  rejoinGameWithGameId,
};
