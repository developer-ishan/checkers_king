const movePiece = require("./movePiece");

/*TODO: DISCLAIMER :-

all code in this file isn't throughly tested, and most of it is directly pasted from chotu
if there are any mishappenings due to this code... please don't abuse me

Yours Sincerely,
MojoAlpha 
*/

var nextGameId = 0;
const games = [];

const getGameForPlayer = (UserSocket) => {
  return games.find((game) => {
    game.players.find((player) => player.socket === UserSocket);
  });
};

exports.getGameByID = (GameId) => {
  games.find((game) => game.id === GameId);
};

exports.getGames = () => {
  let res = [];
  games.map((g) => {
    const { players, ...game } = g;
    res.push({
      ...game,
      playerCount: players.length,
    });
  });
  return res;
};

exports.createNewGame = ({ player, name }) => {
  const game = {
    name,
    turn: "Red",
    players: [{ socket: player, color: "Red" }],
    id: nextGameId++,
    board: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
    ],
  };
  games.push(game);
  return game;
};

exports.movePiece = ({ player, selectedPiece, destination }) => {
  const game = getGameForPlayer(player);
  movePiece({ game, destination, selectedPiece });
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
  const game = getGameForPlayer(player);
  // players might disconnect while in the lobby
  if (!game) return;
  games.splice(games.indexOf(game), 1);
  game.players.forEach((currentPlayer) => {
    if (player !== currentPlayer.socket) currentPlayer.socket.emit("end-game");
    if (winner) currentPlayer.socket.emit("winner", winner);
  });
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
    return "black";
  } else if (blackCount === 0) {
    return "red";
  } else {
    return false;
  }
};