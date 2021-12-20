const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema
const friendSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["NEW", "SEEN", "REJECTED", "ACCEPTED"],
    default: "NEW",
  },
  text: String,
});

// Create a model
const Friend = mongoose.model("friend", friendSchema);

// Export the model
module.exports = {Friend, friendSchema};