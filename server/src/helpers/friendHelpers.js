const { text } = require("express");
const User = require("../models/User");
const { Friend } = require("../models/Friend");

exports.sendRequest = async (senderId, receiverId, text) => {
  const receiver = await User.findOne({ _id: receiverId });
  if (
    receiver.friends.some((friend) => {
      return friend.user.toString() == senderId;
    })
  ) {
    console.log("Already a friend or request is in the queue");
    return false;
  }
  receiver.friends.push(
    new Friend({
      user: senderId,
      text: text,
    })
  );
  const savedReceiver = await receiver.save();
  return savedReceiver;
};
