const { getGameByID, saveChatToGame } = require("../gameManager");

module.exports = ({ gameId, msg, io, socket }) => {
  const from = socket.id;
  gameId = parseInt(gameId);
  const game = getGameByID(gameId);
  if (game === undefined) return;

  const temp = game.players[0];
  let fromUserIndex;
  let fromUser, toUser;
  if (temp.socket.id == from) fromUserIndex = 0;
  else fromUserIndex = 1;

  fromUser = game.players[fromUserIndex];
  toUser = game.players[1 - fromUserIndex];

  console.log("game user:", game.players);

  //saving the chat in the game itself
  //here the userId is the userId from login \
  //this is not socket id
  saveChatToGame(gameId, { user: fromUser.id.toString(), msg: msg });
  // game.chat = [...game.chat, { user: fromUser.id.toString(), msg: msg }];

  console.log("game object", game);
  socket.to(toUser.socket.id).emit("receive-msg", msg);
};
