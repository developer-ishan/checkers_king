const Chat = require("../models/Chat");
const saveChat = async (users, match, messages) => {
  const chat = new Chat({ users, match, messages });
  return await chat.save();
};
const saveMatch = async () => {
  
};
/**
 * ip: matchId
 * token
 * (u)
 */
module.exports = { saveChat, saveMatch };
