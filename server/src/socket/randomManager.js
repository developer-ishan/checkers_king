const { createNewGame, addPlayerToGame } = require("./gameManager");
var jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const User = require("../models/User");

var waitingGuests = [];
var waitingPlayers = [];

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
  waitingGuests.map((guest) => {
    if (mandatoryMoves === guest.mandatoryMoves) {
      // create game b/w these two matching guests
      const newGame = await createNewGame({
        player,
        isBot: false,
        botLevel: 2,
        color: "Red",
        mandatoryMoves,
        isRated: false,
        token: guestId,
      });

      addPlayerToGame({
        player: guest.player,
        gameId: newGame.id,
        token: guestId,
      });

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
  });
  // if the conditions for match didn't match push guest into waiting queue
  waitingGuests.push({ player, guestId, mandatoryMoves });
  return null;
};

exports.randomPlayWithUser = async ({ player, token, mandatoryMoves }) => {
  let user = null;
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

  waitingPlayers.map((player) => {
    if (
      mandatoryMoves === player.mandatoryMoves &&
      playerLeague === player.league
    ) {
      const newGame = createNewGame({
        player,
        isBot: false,
        botLevel: 2,
        color: "Red",
        mandatoryMoves,
        isRated: true,
        token,
      });
      addPlayerToGame({
        player: player.player,
        gameId: newGame.id,
        token: player.token,
      });
      waitingPlayers.splice(
        waitingPlayers.indexOf({
          player: player.player,
          token: player.token,
          mandatoryMoves: player.mandatoryMoves,
          league: player.league,
        })
      );
      return newGame;
    }
  });
  waitingPlayers({ player, token, mandatoryMoves, league: playerLeague });
  return null;
};
