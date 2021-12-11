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
const { saveMatch } = require("../helpers/matchHelpers");

// set of all the ongoing games
const games = [];

// gets the game where player is the playing
const getGameForPlayer = (player) => {
  return games.find((game) => {
    return game.players.find((p) => p.socket === player);
  });
};

// gets the game by the gameId assigned while creation
exports.getGameByID = (GameId) => {
  return games.find((g) => g.id === GameId);
};

// gets the trimmed information of ongoing games to join
exports.getGames = () => {
  let res = [];
  games.map((g) => {
    res.push({
      id: g.id,
      playerCount: g.players.length,
    });
  });
  return res;
};

// returns a game where the user with token belongs
exports.getGameByUserId = async (token) => {
  let userId = null;
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
  console.log("games array:", games);
  return games.find((game) => {
    console.log(`for ${game.id} players :${game.players}`);
    return game.players.find((p) => p.id.toString() === userId.toString());
  });
};

// creates an instance of game and pushes into the games array
exports.createNewGame = async ({
  player,
  isBot,
  botLevel,
  color,
  mandatoryMoves,
  isRated,
  token,
}) => {
  let userId = null,
    matchId = crypto.randomBytes(4).toString("hex");
  // checking for registered user to create the game
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

  // creating game object with respective credentials
  const game = {
    turn: "Red",
    players: [{ socket: player, color, id: userId }],
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
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 1, 0, 0, 0, 0],
      // [0, 0, 0, 0, 2, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    isBot,
    isRated,
    botLevel,
    mandatoryMoves,
    chat: [],
  };
  games.push(game);
  console.log("game create with id ", matchId);
  return game;
};

// moves the piece on the board of the game player is currently playing
exports.movePiece = ({ player, selectedPiece, destination }) => {
  const game = getGameForPlayer(player);
  if (game !== undefined)
    movePiece({
      game,
      destination,
      selectedPiece,
    });
  return game;
};

// adds the player as an opponent to the game with id gameId
exports.addPlayerToGame = async ({ player, gameId, token }) => {
  const game = games.find((game) => game.id === gameId);
  let userId = null;
  // checking for registered user to create the game
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
  // determining the piece color of the opponent
  let color = game.players[0].color === "Red" ? "Black" : "Red";
  game.players.push({
    color,
    socket: player,
    id: userId,
  });
  return color;
};

// saves the chat into the game object
exports.saveChatToGame = (gameId, msgObject) => {
  const game = games.find((game) => game.id === gameId);
  game.chat.push(msgObject);
};

// gets the color of the piece of player playing the game
exports.getColorOfPlayer = ({ player }) => {
  const game = getGameForPlayer(player),
    pc = game.players[0].color;
  if (game.players[0].socket === player) return pc === "Red" ? "Black" : "Red";
  return pc;
};

// ends the game : removes the game object from the games array & saves it into the db
exports.endGame = async ({ player, winner }) => {
  const game = getGameForPlayer(player);
  if (game) {
    // handles condition for two different players
    if (game.isBot === false) {
      let p1 =
        game.players[0].color === winner ? game.players[0] : game.players[1];
      let p2 = p1 === game.players[0] ? game.players[1] : game.players[0];
      let isDraw = winner === false ? true : false;
      await saveMatch(
        p1,
        p2,
        game.pieceMoves,
        game.createTime,
        new Date(),
        game.chat,
        isDraw,
        game.isBot
      );
    } else {
      // handles condition for game with bots
      await saveMatch(
        game.players[0],
        null, // TODO: for bot maybe we can add level of the bot
        game.pieceMoves,
        game.createTime,
        new Date(),
        game.chat,
        false, // considering that you cannot propose draw with bot
        game.isBot
      );
    }
    console.log("game saved");
    games.splice(games.indexOf(game), 1);
    return game;
  }
  return null;
};

// function to determing the winning condition of a player; when he cannot move any piece the opponent wins
const getAllMovesCountByPlayer = ({ board, color }) => {
  let pieces = getAllPieces({ board, color }),
    movesCount = 0;
  for (let i = 0; i < pieces.length; ++i) {
    movesCount += getPossibleMoves({ board, piece: pieces[i] }).length;
  }
  return movesCount;
};

// checks the condition when any of the player wins; return false if game can continue on
exports.isGameOver = ({ player }) => {
  const game = getGameForPlayer(player);

  let redCount =
    getPiecesCount({ board: game.board, type: 1 }) +
    getPiecesCount({ board: game.board, type: 3 });
  let blackCount =
    getPiecesCount({ board: game.board, type: 2 }) +
    getPiecesCount({ board: game.board, type: 4 });
  // black wins if count of red pieces is 0 or red cannot make a move
  if (
    redCount === 0 ||
    getAllMovesCountByPlayer({ board: game.board, color: "Red" }) === 0
  )
    return "Black";
  // red wins if count of black pieces is 0 or black cannot make a move
  else if (
    blackCount === 0 ||
    getAllMovesCountByPlayer({ board: game.board, color: "Black" }) === 0
  )
    return "Red";
  else return false;
};
