const { check } = require("express-validator");
const { userDpStore } = require("../config/multrStore");
const User = require("../models/User");
const multer = require("multer");
const keys = require("../config/keys");
const { filterPhoto } = require("../helpers/photoHelper");
const Friend = require("../models/Friend");
exports.deleteUser = async (req, res, next) => {
  try {
    req.user.active = false;
    const edited = await req.user.save();
    res.json(edited);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const { desc, username } = req.body;
    const present = await User.findOne({ username: username });
    if (present && present._id.toString() != req.user._id.toString())
      return res.status(400).json({ success: false, msg: "Username taken" });
    req.user.username = username;
    req.user.desc = desc;
    const edited = await req.user.save();
    res.json({ ...edited._doc, success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getMySummary = async (req, res, next) => {
  try {
    const val = {};
    val.username = req.user.username;
    val._id = req.user._id;
    val.active = req.user.active;
    if (req.user.photo) {
      val.photo = keys.SERVER_BASE + "/public/dp/" + req.user.photo;
    } else if (req.user.facebook) {
      val.photo = req.user.facebook.photo;
    } else if (req.user.google) {
      val.photo = req.user.google.photo;
    }
    if (!req.user.photo)
      req.user.photo = keys.SERVER_BASE + "/public/dp/default.png";
    val.desc = req.user.desc;
    res.json(val);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user || !user.active)
      return res.status(404).json({ msg: "No such user found" });
    user.photo = filterPhoto(user);
    res.json({
      _id: user._id,
      username: user.username,
      google: user.google,
      facebook: user.facebook,
      desc: user.desc,
      photo: user.photo,
      rating: user.rating,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.uploadProfilePic = (req, res, next) => {
  userDpStore(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    req.user.photo = req.file.filename;
    await req.user.save();
    res.json({
      success: true,
      filename: req.file.filename,
    });
    // return res.status(200).send(req.file);
  });
};

exports.getUserByUsername = async (req, res, next) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  const foundUsers = await User.find(
    { username: { $regex: ".*" + q + ".*", $options: "i" } },
    "username photo methods rating desc google facebook"
  );
  if (!foundUsers) return res.json([]);
  const filteredFoundUsers = foundUsers.map((user) => {
    const ret = {};
    ret._id = user._id;
    ret.username = user.username;
    ret.photo = filterPhoto(user);
    ret.rating = user.rating;
    ret.desc = user.desc;
    return ret;
  });
  res.json(filteredFoundUsers);
};

exports.getNotFriendsByUserName = async (req, res, next) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  const friends_doc = await Friend.find({$or : [{requester: req.user._id}, {recipient: req.user._id}]}, "_id");
  const friends = friends_doc.map(f => f._id);
  const foundUsers = await User.find(
    {
      username: { $regex: ".*" + q + ".*", $options: "i" },
      friends: { $nin: friends },
    },
    "username photo methods rating desc google facebook friends"
  );
  if (!foundUsers) return res.json([]);
  const filteredFoundUsers = foundUsers.map((user) => {
    const ret = {};
    ret._id = user._id;
    ret.username = user.username;
    ret.photo = filterPhoto(user);
    ret.rating = user.rating;
    ret.desc = user.desc;
    return ret;
  });
  res.json(foundUsers);
};
