const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
var generateName = require("sillyname");

// Create a schema
const chatSchema = new Schema({
  users:[String],
  match:String,
  messages: []
});

// Create a model
const Chat = mongoose.model("user", chatSchema);

// Export the model
module.exports = Chat;