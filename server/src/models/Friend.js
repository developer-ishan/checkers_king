const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema
const friendSchema = new Schema(
  {
    requester: { type: mongoose.Types.ObjectId, ref: "user" },
    recipient: { type: mongoose.Types.ObjectId, ref: "user" },
    status: {
      type: String,
      enum: ["NEW", "REQUESTED", "PENDING", "FRIENDS"],
      default: "NEW",
    },
    text: String,
  },
  { timestamps: true }
);

// Create a model
const Friend = mongoose.model("friend", friendSchema);

// Export the model
module.exports = Friend;
