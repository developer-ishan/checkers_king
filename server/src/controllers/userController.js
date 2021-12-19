const { check } = require("express-validator");
const { userDpStore } = require("../config/multrStore");
const User = require("../models/User");
const multer = require("multer");
const keys = require("../config/keys");
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
    if(!req.user.photo)
      req.user.photo = keys.SERVER_BASE + "/public/dp/default.png"
    val.desc = req.user.desc;
    console.log(val);
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
    if (user.photo) {
    } else if (user.facebook) {
      user.photo = user.facebook.photo;
    } else if (user.google) {
      user.photo = user.google.photo;
    }
    res.json({
      _id: user._id,
      username: user.username,
      google: user.google,
      facebook: user.facebook,
      desc: user.desc,
      photo: photo,
    });
  } catch (err) {
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
  const foundUsers = await User.find(
    { username: { $regex: ".*" + q + ".*" } },
    "username photo methods rating desc google facebook"
  );
  if (!foundUsers)
    return res.status(404).json({
      success: false,
      msg: "No such user found",
    });
  const filteredFoundUsers = foundUsers.map(user => {
    const ret = {};
    ret.username = user.username;
    ret.photo = user.photo;
    ret.rating = user.rating;
    ret.desc = user.desc;

    if (user.photo) {
      ret.photo = keys.SERVER_BASE + "/public/dp/" + user.photo;
    } else if (user.facebook) {
      ret.photo = user.facebook.photo;
    } else if (user.google) {
      ret.photo = user.google.photo;
    }
    if(!ret.photo)
      ret.photo = keys.SERVER_BASE + "/public/dp/default.png"
    return ret;
  })
  res.json(filteredFoundUsers);
};
