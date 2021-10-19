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
  startTime: Date,
  endTime: Date,
});

// Create a model
const Match = mongoose.model("match", matchSchema);

// Export the model
module.exports = Match;
