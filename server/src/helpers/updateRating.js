const User = require("../models/User");
const { pow, round } = Math;
const K = 30;
const Probability = (rating1, rating2) => {
  return (1.0 * 1.0) / (1 + 1.0 * pow(10, (1.0 * (rating1 - rating2)) / 400));
};
const EloRating = (Ra, Rb) => {
  // To calculate the Winning
  // Probability of Player B
  const Pb = Probability(Ra, Rb);

  // To calculate the Winning
  // Probability of Player A
  const Pa = Probability(Rb, Ra);

  Ra = Ra + K * (1 - Pa);
  Rb = Rb + K * (0 - Pb);
  return { winnerNew: round(Ra), loserNew: round(Rb) };
};

const updateRating = async (winnerId, loserId) => {
  const winner = await User.findById(winnerId);
  const loser = await User.findById(loserId);
  const { winnerNew, loserNew } = EloRating(winner.rating, loser.rating);

  const deltaWinner = winnerNew - winner.rating;
  const deltaLoser = loserNew - loser.rating;

  winner.rating = winnerNew;
  loser.rating = loserNew;

  await winner.save();
  await loser.save();
  return {
    winnerNew,
    loserNew,
    deltaLoser,
    deltaWinner,
  };
};

module.exports = updateRating;
