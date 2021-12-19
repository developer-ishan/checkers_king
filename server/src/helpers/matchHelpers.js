const Chat = require("../models/Chat");
const Match = require("../models/Match");
const updateRating = require("./updateRating");

const saveChat = async (users, match, messages) => {
  const chat = new Chat({ users, match, messages });
  return await chat.save();
};

const isPlayerAGuest = (p1, p2) => {
  return p1.startsWith("guest") || p2.startsWith("guest");
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
  if (!isBot && !isDraw && isRated && !isPlayerAGuest(p1.id, p2.id))
    ratingsUpdate = await updateRating(p1.id, p2.id);
  let game = new Match({
    players: [],
    moves,
    startTime,
    endTime,
  });

  if (isPlayerAGuest(p1.id, p2.id)) {
    console.log("game with a guest... not saving and returning...");
    return;
  }
  // handles draw condition between players
  if (isBot) {
    // handles games with bots
    console.log("saving game against bot...");
    game.players.push({ userId: p1.id, delta: 0, color: p1.color });
  } else if (isDraw || !isRated) {
    console.log("saving unrated game");
    game.players.push({ userId: p1.id, delta: 0, color: p1.color });
    game.players.push({ userId: p2.id, delta: 0, color: p2.color });
  } else {
    // handles game between two players
    console.log("saving rated game...");
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
