const { text } = require("express");
const User = require("../models/User");
const Friend = require("../models/Friend");
//usera request userb
exports.sendRequest = async (UserA, UserB, text) => {
  console.log(UserA, UserB);
  const docA = await Friend.findOneAndUpdate(
    { requester: UserA, recipient: UserB },
    { $set: { status: "REQUESTED", text: text } },
    { upsert: true, new: true }
  );
  const docB = await Friend.findOneAndUpdate(
    { recipient: UserA, requester: UserB },
    { $set: { status: "PENDING", text: text } },
    { upsert: true, new: true }
  );
  const updateUserA = await User.findOneAndUpdate(
    { _id: UserA },
    { $addToSet: { friends: docA._id } }
  );
  const updateUserB = await User.findOneAndUpdate(
    { _id: UserB },
    { $addToSet: { friends: docB._id } }
  );
  return updateUserA;
};
//userb accepts
exports.acceptRequest = async (UserA, UserB) => {
  await Friend.findOneAndUpdate(
    { requester: UserA, recipient: UserB },
    { $set: { status: "FRIENDS" } }
  );
  await Friend.findOneAndUpdate(
    { recipient: UserA, requester: UserB },
    { $set: { status: "FRIENDS" } }
  );
};
//userb rejects
exports.rejectRequest = async (UserA, UserB) => {
  const docA = await Friend.findOneAndRemove({
    requester: UserA,
    recipient: UserB,
  });
  const docB = await Friend.findOneAndRemove({
    recipient: UserA,
    requester: UserB,
  });
  const updateUserA = await User.findOneAndUpdate(
    { _id: UserA },
    { $pull: { friends: docA._id } }
  );
  const updateUserB = await User.findOneAndUpdate(
    { _id: UserB },
    { $pull: { friends: docB._id } }
  );
};
