const { text } = require("express");
const { Friend } = require("../models/Friend");
const User = require("../models/User");

exports.sendRequest = async (senderId, receiverId, text) => {
  const receiver = await User.findOne({ _id: receiverId });
  receiver.friends.push(
    new Friend({
      user: senderId,
      text: text,
    })
  );
  const savedReceiver = await receiver.save();
  return savedReceiver;
};