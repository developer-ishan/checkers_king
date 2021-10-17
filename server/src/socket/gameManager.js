const movePiece = require("./movePiece");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET } = require("../config/keys");
const User = require("../models/User");
const {
  getAllPieces,
  getPossibleMoves,
  getPiecesCount,
} = require("./helpers/botHelpers");

const games = [];

const getGameForPlayer = (player) => {
  return games.find((game) => {
    return game.players.find((p) => p.socket === player);
  });
};

exports.getGameByID = (GameId) => {
  return games.find((g) => g.id === GameId);
};

exports.getGames = () => {
  let res = [];
  games.map((g) => {
    const { players, board, ...game } = g;
    res.push({
      ...game,
      playerCount: players.length,
    });
  });
  return res;
};

exports.createNewGame = async ({
  player,
  name,
  isBot,
  mandatoryMoves,
  token,
}) => {
  let userId = null,
    matchId = crypto.randomBytes(4).toString("hex");
  if (token) {
    try {
      var decoded = jwt.verify(token, JWT_SECRET).sub;
      const user = await User.findById(decoded);
      console.log(user.username, " created the game");
      if (user) userId = user._id;
    } catch (err) {
      console.log(err);
    }
  }

  const game = {
    name,
    turn: "Red",
    players: [{ socket: player, color: "Red", id: userId }],
    id: matchId,
    createTime: new Date(),
    pieceMoves: [],
    board: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 1, 0, 0, 0],
      // [0, 0, 1, 0, 0, 0, 0, 0],
      // [0, 2, 0, 2, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 2, 0, 2, 2, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    isBot,
    mandatoryMoves,
    chat: [],
  };
  games.push(game);
  return game;
};

exports.movePiece = ({ player, selectedPiece, destination }) => {
  console.log("inside move piece function...");
  console.log({ selectedPiece, destination });
  const game = getGameForPlayer(player);
  if (game !== undefined)
    movePiece({
      game,
      destination,
      selectedPiece,
    });
  return game;
};

exports.addPlayerToGame = async ({ player, gameId, token }) => {
  const game = games.find((game) => game.id === gameId);
  let userId = null;
  if (token) {
    try {
      var decoded = jwt.verify(token, JWT_SECRET).sub;
      const user = await User.findById(decoded);
      if (user) {
        console.log(user.username, " joined the game");
        userId = user._id;
      }
    } catch (err) {
      console.log(err);
    }
  }
  game.players.push({
    color: "Black",
    socket: player,
    id: userId,
  });
  return "Black";
};

exports.saveChatToGame = (gameId, msgObject) => {
  const game = games.find((game) => game.id === gameId);
  game.chat.push(msgObject);
};

exports.endGame = ({ player, winner }) => {
  // TODO: save the information of the game into the db
  // TODO: what happens if a player quits the game
  const game = getGameForPlayer(player);
  if (game) {
    games.splice(games.indexOf(game), 1);
    if (winner) {
      console.log("endgame insiders.... ", winner);
    }
    // game.players.forEach((currentPlayer) => {
    //   if (winner) currentPlayer.socket.emit("winner", winner);
    // });
    return game;
  }
  return null;
};

const getAllMovesCountByPlayer = ({ board, color }) => {
  let pieces = getAllPieces({ board, color }),
    movesCount = 0;
  for (let i = 0; i < pieces.length; ++i) {
    movesCount += getPossibleMoves({ board, piece: pieces[i] }).length;
  }
  return movesCount;
};

exports.isGameOver = ({ player }) => {
  const game = getGameForPlayer(player);

  let redCount =
    getPiecesCount({ board: game.board, type: 1 }) +
    getPiecesCount({ board: game.board, type: 3 });
  let blackCount =
    getPiecesCount({ board: game.board, type: 2 }) +
    getPiecesCount({ board: game.board, type: 4 });

  if (
    redCount === 0 ||
    getAllMovesCountByPlayer({ board: game.board, color: "Red" }) === 0
  ) {
    return "Black";
  } else if (
    blackCount === 0 ||
    getAllMovesCountByPlayer({ board: game.board, color: "Black" }) === 0
  ) {
    return "Red";
  } else {
    return false;
  }
};
