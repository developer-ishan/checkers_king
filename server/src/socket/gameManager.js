const movePiece = require("./movePiece");

/*TODO: DISCLAIMER :-

all code in this file isn't throughly tested, and most of it is directly pasted from chotu
if there are any mishappenings due to this code... please don't abuse me

Yours Sincerely,
MojoAlpha 
*/

var nextGameId = 0;
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

exports.createNewGame = ({ player, name, isBot }) => {
  const game = {
    name,
    turn: "Red",
    players: [{ socket: player, color: "Red" }],
    id: nextGameId++,
    board: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    isBot,
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

exports.addPlayerToGame = ({ player, gameId }) => {
  const game = games.find((game) => game.id === gameId);
  game.players.push({
    color: "Black",
    socket: player,
  });
  return "Black";
};

exports.endGame = ({ player, winner }) => {
  // TODO: save the information of the game into the db
  const game = getGameForPlayer(player);
  // players might disconnect while in the lobby
  if (game) {
    games.splice(games.indexOf(game), 1);
    if (winner) {
      console.log("endgame insiders.... ", winner);
      // player.to(game.id).emit("winner", winner);
      // player.emit("winner", winner);
    }
    // game.players.forEach((currentPlayer) => {
    //   if (winner) currentPlayer.socket.emit("winner", winner);
    // });
    return game.id;
  }
  return null;
};

exports.isGameOver = ({ player }) => {
  const game = getGameForPlayer(player);

  let redCount = 0;
  let blackCount = 0;
  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board[i].length; j++) {
      if (game.board[i][j] === 1 || game.board[i][j] === 3) {
        redCount++;
      }
      if (game.board[i][j] === 2 || game.board[i][j] === 4) {
        blackCount++;
      }
    }
  }
  if (redCount === 0) {
    return "Black";
  } else if (blackCount === 0) {
    return "Red";
  } else {
    return false;
  }
};
