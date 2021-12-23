const {
  getGameByID,
  saveChatToGame,
} = require("../../../helpers/gameBoardHelpers/gamePlayManager");

module.exports = ({ gameId, msg, io, socket }) => {
  const from = socket.id;
  const game = getGameByID(gameId);
  if (game === undefined) return;

  const temp = game.players[0];
  let fromUserIndex;
  let fromUser, toUser;
  if (temp.socket.id == from) fromUserIndex = 0;
  else fromUserIndex = 1;

  fromUser = game.players[fromUserIndex];
  toUser = game.players[1 - fromUserIndex];

  //saving the chat in the game itself
  //here the userId is the userId from login \
  //this is not socket id
  saveChatToGame(gameId, { user: fromUser.id.toString(), msg: msg });
  // game.chat = [...game.chat, { user: fromUser.id.toString(), msg: msg }];

  socket
    .to(toUser.socket.id)
    .emit("receive-msg", { user: fromUser.id.toString(), msg });
};
