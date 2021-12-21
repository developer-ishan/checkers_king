const movePiece = require("./movePieceHelpers/movePiece");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET } = require("../../../config/keys");
const User = require("../../../models/User");
const { getPiecesCount, getAllMovesCountByPlayer } = require("../gameHelper");
const { saveMatch } = require("../../../helpers/matchHelpers");
const { giveMandatoryMove } = require("./movePieceHelpers/mandatoryMoves");
const { getUserDetailsWithToken } = require("../userManager");

// set of all the ongoing games
var games = [];

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

exports.getGamesList = () => {
  return games;
};

// gets the trimmed information of ongoing games to join
exports.getGames = () => {
  let res = [];
  games.map((g) => {
    if (!g.isBot)
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

  if (token.startsWith("guest")) userId = token;
  else if (token) {
    try {
      var decoded = jwt.verify(token, JWT_SECRET).sub;
      const user = await User.findById(decoded);
      if (user) userId = user._id;
    } catch (err) {
      console.log(err);
    }
  }

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
  console.log("inside createNewGame helper function...");
  let user = await getUserDetailsWithToken(token),
    matchId = crypto.randomBytes(4).toString("hex");
  const { userId, username, photo } = user;

  // creating game object with respective credentials
  const game = {
    turn: "Red",
    players: [
      {
        socket: player,
        color,
        id: userId,
        username,
        photo,
      },
    ],
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
      // [0, 0, 0, 1, 0, 0, 0, 0],
      // [0, 0, 0, 0, 2, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
      // [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    isBot,
    botLevel,
    isRated,
    mandatoryMoves,
    chat: [],
  };

  games.push(game);
  console.log("game create successfully! ID :- ", matchId);
  return game;
};

// saving the piece move to respective game's data
const savePieceMoveToGame = ({ game, destination, selectedPiece }) => {
  const pieceMove =
    game.turn[0] +
    selectedPiece.i.toString() +
    selectedPiece.j.toString() +
    destination.i.toString() +
    destination.j.toString();
  game.pieceMoves.push(pieceMove);
};

// switch the turn of user in the game
const switchGameTurn = ({ game }) => {
  game.turn = game.turn === "Red" ? "Black" : "Red";
};

exports.isMandatoryMove = (selectedPiece, destination) => {
  const diffI = Math.abs(selectedPiece.i - destination.i);
  const diffJ = Math.abs(selectedPiece.j - destination.j);
  return diffI === 2 && diffJ === 2;
};

const emitGameStatus = (io, game) => {
  io.to(game.id).emit("game-status", {
    id: game.id,
    board: game.board,
    turn: game.turn,
  });
};

const initiateMandatoryMove = async (io, game, destination) => {
  console.log("initiating mandatory moves...");
  let currPiece = destination;
  let destPiece = giveMandatoryMove(game.board, currPiece);

  while (destPiece !== null) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    emitGameStatus(io, game);

    const moveResults = movePiece({
      board: game.board,
      destination: destPiece,
      selectedPiece: currPiece,
    });
    if (moveResults === null) break;
    savePieceMoveToGame({
      game,
      destination: destPiece,
      selectedPiece: currPiece,
    });
    currPiece = destPiece;
    destPiece = giveMandatoryMove(game.board, currPiece);
  }
};

// moves the piece on the board of the game player is currently playing
exports.onMovePiece = async ({ io, player, selectedPiece, destination }) => {
  const game = getGameForPlayer(player);
  if (game !== undefined) {
    const moveResults = movePiece({
      board: game.board,
      destination,
      selectedPiece,
    });
    if (moveResults !== null) {
      savePieceMoveToGame({ game, selectedPiece, destination });
      if (
        game.mandatoryMoves &&
        this.isMandatoryMove(selectedPiece, destination)
      )
        await initiateMandatoryMove(io, game, destination);
      switchGameTurn({ game });
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  return game;
};

// adds the player as an opponent to the game with id gameId
exports.addPlayerToGame = async ({ player, gameId, token }) => {
  const game = games.find((game) => game.id === gameId);
  let user = await getUserDetailsWithToken(token);
  const { userId, username, photo } = user;

  // determining the piece color of the opponent
  let color = game.players[0].color === "Red" ? "Black" : "Red";
  game.players.push({
    socket: player,
    color,
    id: userId,
    username,
    photo,
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
      console.log("saving game with opponent player");
      // p1 is the winning player & p2 is the losing player
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
        game.isBot,
        game.isRated
      );
    } else {
      // handles condition for game with bots
      console.log("saving game with bots to profile...");
      await saveMatch(
        game.players[0],
        null, // TODO: for bot maybe we can add level of the bot
        game.pieceMoves,
        game.createTime,
        new Date(),
        game.chat,
        false, // considering that you cannot propose draw with bot
        true,
        false
      );
    }
    games.splice(games.indexOf(game), 1);
    return game;
  }
  return null;
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
