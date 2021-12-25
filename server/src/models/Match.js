const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema
const matchSchema = new Schema({
  players: [
    {
      userId: String,
      delta: Number,
      updatedRating: Number,
      color: String,
    },
  ],
  moves: [{ type: String }],
  botLevel: {
    type: Number,
    default: -1,
  },
  isRated: Boolean,
  mandatoryMoves: Boolean,
  winner: String,
  startTime: Date,
  endTime: Date,
});

// Create a model
const Match = mongoose.model("match", matchSchema);

// Export the model
module.exports = Match;
