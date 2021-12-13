const { createNewGame, addPlayerToGame } = require("./gamePlayManager");
var jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../config/keys");
const User = require("../../../models/User");

var waitingGuests = [];
var waitingPlayers = [];

// gives the league of the player with a particular rating
const get_league = (rating) => {
  if (rating < 800) return ["Bronze", 0, 800, "🥉"];
  if (rating < 1000) return ["Silver", 1, 1000, "🥈"];
  if (rating < 1200) return ["Gold", 2, 1200, "🥇"];
  if (rating < 1400) return ["Platinum", 3, 1400, "✨"];
  if (rating < 1600) return ["Diamond", 4, 1600, "💎"];
  if (rating < 1800) return ["Ruby", 5, 1800, "🔴💎"];
  if (rating < 2000) return ["Master", 6, 2000, "🧑🏻‍💼"];
  if (rating < 2200) return ["Grandmaster", 7, 2200, "🧑🏻‍🎓"];
  return ["Champion", 8, 2400, "🏆🏅"];
};

exports.randomPlayWithGuest = async ({ player, guestId, mandatoryMoves }) => {
  // searching for player in queue with similar specifications
  for (let i = 0; i < waitingGuests.length; ++i) {
    let guest = waitingGuests[i];
    if (mandatoryMoves === guest.mandatoryMoves) {
      // creating a new game
      const newGame = await createNewGame({
        player,
        isBot: false,
        botLevel: -1,
        color: "Red",
        mandatoryMoves,
        isRated: false,
        token: guestId,
      });
      // adding another player to the game
      await addPlayerToGame({
        player: guest.player,
        gameId: newGame.id,
        token: guestId,
      });
      // removing the opponent from the waiting queue
      waitingGuests.splice(
        waitingGuests.indexOf({
          player: guest.player,
          guestId: guest.guestId,
          mandatoryMoves,
        }),
        1
      );
      return newGame;
    }
  }

  // if the conditions for match didn't match push guest into waiting queue
  waitingGuests.push({ player, guestId, mandatoryMoves });
  return null;
};

exports.randomPlayWithUser = async ({ player, token, mandatoryMoves }) => {
  let user = null;
  // recognising the user as registered
  if (token) {
    try {
      var decoded = jwt.verify(token, JWT_SECRET).sub;
      user = await User.findById(decoded);
    } catch (err) {
      console.log(err);
    }
  }
  if (user === null) return;
  const playerLeague = get_league(user.rating)[0];

  // searching for appropriate player to start the game with
  for (let i = 0; i < waitingPlayers.length; ++i) {
    let possiblePlayer = waitingPlayers[i];
    if (
      mandatoryMoves === possiblePlayer.mandatoryMoves &&
      playerLeague === possiblePlayer.league
    ) {
      // creating a new game
      const newGame = await createNewGame({
        player,
        isBot: false,
        botLevel: -1,
        color: "Red",
        mandatoryMoves,
        isRated: true,
        token,
      });
      // adding the other player as opponent
      await addPlayerToGame({
        player: possiblePlayer.player,
        gameId: newGame.id,
        token: possiblePlayer.token,
      });
      // removing the players from the waiting  queue
      waitingPlayers.splice(
        waitingPlayers.indexOf({
          player: possiblePlayer.player,
          token: possiblePlayer.token,
          mandatoryMoves: possiblePlayer.mandatoryMoves,
          league: possiblePlayer.league,
        })
      );
      return newGame;
    }
  }
  // if the player with specifications isn't found push player into the waiting queue
  waitingPlayers.push({
    player,
    token,
    mandatoryMoves,
    league: playerLeague,
  });
  console.log(waitingPlayers);
  return null;
};
