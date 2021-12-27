const { getGamesList, getGameByID } = require("./gamePlayManager");
const {
  getUserDetailsWithToken,
  findOnlineUserById,
  findOnlineUserByToken,
} = require("../userManager");
const { parsePieceMove } = require("../gameHelper");
const { sendUserStatus } = require("../userStatusHelper");

// find a game with a player with a particular id
const findPlayersWithID = (playerId) => {
  const games = getGamesList();
  return games.find((game) => {
    return game.players.find((player) => player.id === playerId);
  });
};

// returns the fileterd player array of a game with given id
const getGamePlayersWithGameId = (game) => {
  let players = [];
  game.players.map((player) =>
    // filtered data to send to client
    players.push({
      id: player.id,
      color: player.color,
      username: player.username,
      photo: player.photo,
    })
  );

  if (game.isBot) {
    players.push({
      id: `Bot_Lvl${game.botLevel}`,
      color: players[0].color === "Red" ? "Black" : "Red",
      username: `Bot_Lvl${game.botLevel}`,
      photo: "/images/bot.png",
    });
  }
  return players;
};

// finding the game with a game ID
const getGameWithGameId = (gameId) => {
  const game = getGameByID(gameId);
  if (!game) return game;
  let players = getGamePlayersWithGameId(game);
  return { id: game.id, turn: game.turn, players };
};

// checking if a user is already present in an ongoing game
const isUserAlreadyInGame = async (token) => {
  const userDetails = await getUserDetailsWithToken(token);
  if (!userDetails) return null;
  const userGame = findPlayersWithID(userDetails.userId);
  if (userGame) return userGame.id;
  return userGame;
};

const isUserAlreadyInGameUserId = async (userId) => {
  const userGame = findPlayersWithID(userId);
  if (userGame) return userGame.id;
  return userGame;
};

const setInGameStatus = async (io, game) => {
  game.players.forEach(async (player) => {
    const user = findOnlineUserById(player.id);
    user.status = "IN_GAME";
    await sendUserStatus(io, user.userId);
  });
};

const resetInGameStatus = async (io, game) => {
  game.players.forEach(async (player) => {
    const user = findOnlineUserById(player.id);
    user.status = "IDLE";
    await sendUserStatus(io, user.userId);
  });
};

// rejoining a player into an existing game
const rejoinGameWithGameId = async (io, socket, gameId, token) => {
  const existingGame = await isUserAlreadyInGame(token);
  const userDetails = await getUserDetailsWithToken(token);
  let socketPlayer = null;

  if (existingGame !== gameId) return;
  const game = getGameByID(gameId);
  game.players.map((player) => {
    if (player.id === userDetails.userId) {
      // exchangin the existing socket of the game with the new socket
      player.socket = socket;
      socketPlayer = player;
      socket.join(gameId);
    }
  });

  // emitting event to the client
  socket.emit("game-status", {
    id: game.id,
    board: game.board,
    turn: game.turn,
    lastMove: parsePieceMove(game.pieceMoves[game.pieceMoves.length - 1]),
  });
  socket.emit("color", socketPlayer.color);
  socket.emit("players-info", getGamePlayersWithGameId(game));
  const roomSocketCnt = io.sockets.adapter.rooms.get(game.id).size;
  io.to(game.id).emit("head-count", roomSocketCnt);
  await new Promise((resolve) => setTimeout(resolve, 20));

  const user = findOnlineUserByToken(token);
  user.status = "IN_GAME";
  await sendUserStatus(io, user.userId);

  socket.emit("old-chats-on-rejoin", game.chat);
};

module.exports = {
  isUserAlreadyInGame,
  getGamePlayersWithGameId,
  getGameWithGameId,
  rejoinGameWithGameId,
  isUserAlreadyInGameUserId,
  setInGameStatus,
  resetInGameStatus,
};
