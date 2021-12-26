const { filterPhoto } = require("../helpers/photoHelper");
const Friend = require("../models/Friend");
const User = require("../models/User");
exports.getMyFriends = async (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({
      path: "friends",
      match: { status: "FRIENDS" },
      populate: [
        { path: "recipient", select: "username photo rating google facebook" },
      ],
    })
    .exec((err, populated) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      const friends = populated.friends.map((friend) => {
        const ret = {};
        ret.userId = friend.recipient._id;
        ret.username = friend.recipient.username;
        ret.photo = filterPhoto(friend.recipient);
        ret.status = friend.status;
        return ret;
      });
      res.json(friends);
    });
};

exports.getMyFriendRequests = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({
      path: "friends",
      match: { status: "PENDING" },
      populate: [
        { path: "recipient", select: "username photo rating google facebook" },
      ],
    })
    .exec((err, populated) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      const friends = populated.friends.map((friend) => {
        const ret = {};
        ret.userId = friend.recipient._id;
        ret.username = friend.recipient.username;
        ret.photo = filterPhoto(friend.recipient);
        ret.status = friend.status;
        return ret;
      });
      res.json(friends);
    });
};

exports.getMySentRequests = async (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate({
      path: "friends",
      match: { status: "REQUESTED" },
      populate: [
        { path: "recipient", select: "username photo rating google facebook" },
      ],
    })
    .exec((err, populated) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      const friends = populated.friends.map((friend) => {
        const ret = {};
        ret.userId = friend.recipient._id;
        ret.username = friend.recipient.username;
        ret.photo = filterPhoto(friend.recipient);
        ret.status = friend.status;
        return ret;
      });
      res.json(friends);
    });
};

exports.getFriendShipStatus = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    if (userId) {
      const status = await Friend.findOne({
        requester: req.user._id,
        recipient: userId,
      });
      if (status) return res.json(status);
      return res.json({ status: "ADD" });
    } else {
      return res.status(400).json({
        success: false,
        msg: "give a user id",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
