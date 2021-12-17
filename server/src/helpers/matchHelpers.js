const Chat = require("../models/Chat");
const Match = require("../models/Match");
const updateRating = require("./updateRating");

const saveChat = async (users, match, messages) => {
  const chat = new Chat({ users, match, messages });
  return await chat.save();
};
const saveMatch = async (
  p1,
  p2,
  moves,
  startTime,
  endTime,
  messages,
  isDraw,
  isBot,
  isRated
) => {
  let ratingsUpdate = null;
  if (!isBot && !isDraw) ratingsUpdate = await updateRating(p1.id, p2.id);
  let game = new Match({
    players: [],
    moves,
    startTime,
    endTime,
  });
  if(p1.id.startsWith("guest") || p2.id.startsWith("guest")){
    return;
  }
  // handles draw condition between players
  if (isBot) {
    // handles games with bots
    game.players.push({ userId: p1.id, delta: 0, color: p1.color });
  } else if (isDraw || !isRated) {
    game.players.push({ userId: p1.id, delta: 0, color: p1.color });
    game.players.push({ userId: p2.id, delta: 0, color: p2.color });
  } else {
    // handles game between two players
    game.players.push({
      userId: p1.id,
      delta: ratingsUpdate.deltaWinner,
      updatedRating: ratingsUpdate.winnerNew,
      color: p1.color,
    });
    game.players.push({
      userId: p2.id,
      delta: ratingsUpdate.deltaLoser,
      updatedRating: ratingsUpdate.loserNew,
      color: p2.color,
    });
  }
  const savedGame = await game.save();
  if (!isBot)
    await saveChat([p1.id, p2.id], savedGame._id.toString(), messages);
};
/**
 * ip: matchId
 * token
 * (u)
 */
module.exports = { saveChat, saveMatch };
