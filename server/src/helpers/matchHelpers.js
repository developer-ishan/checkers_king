const Chat = require("../models/Chat");
const Match = require("../models/Match");
const updateRating = require("./updateRating");

const saveChat = async (users, match, messages) => {
  const chat = new Chat({ users, match, messages });
  return await chat.save();
};
const saveMatch = async (
  players,
  matchId,
  moves,
  startTime,
  endTime,
  messages
) => {
  const ratingsDelta = updateRating(players[0].id, players[1].id);
  const game = new Match({
    players: [
      {
        userId: players[0].id,
        delta: ratingsDelta.deltaWinner,
      },
      {
        userId: players[1].id,
        delta: ratingsDelta.deltaLoser,
      },
    ],
    matchId,
    moves,
    startTime,
    endTime,
  });

  await saveChat([ players[0].id,  players[1].id], matchId, messages);
  return await game.save();
};
/**
 * ip: matchId
 * token
 * (u)
 */
module.exports = { saveChat, saveMatch };
