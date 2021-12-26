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
  winner,
  isBot,
  isRated,
  mandatoryMoves,
  botLevel
) => {
  let ratingsUpdate = null;
  if (!isBot && winner != "Draw" && isRated && !isPlayerAGuest(p1.id, p2.id))
    ratingsUpdate = await updateRating(p1.id, p2.id);
  let game = new Match({
    players: [],
    moves,
    botLevel,
    isRated,
    mandatoryMoves,
    winner,
    startTime,
    endTime,
  });

  if (isBot) {
    // handles games with bots
    if (p1.id.startsWith("guest")) return;
    console.log("saving game against bot...");
    game.players.push({ userId: p1.id, delta: 0, color: p1.color });
  } else if (isPlayerAGuest(p1.id, p2.id)) {
    // not saving the game in case one of the player is guest
    console.log("game with a guest... not saving and returning...");
    return;
  } else if (winner === "Draw" || !isRated) {
    // saving unrated or draw games
    console.log("saving unrated/draw game");
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
  // saving chats of a rated of unrated game of the users
  if (!isBot)
    await saveChat([p1.id, p2.id], savedGame._id.toString(), messages);
};
/**
 * ip: matchId
 * token
 * (u)
 */
module.exports = { saveChat, saveMatch };
