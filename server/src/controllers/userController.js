const { check } = require("express-validator");
// const upload = require("../config/upload");
const User = require("../models/User");
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
    res.json({...edited._doc, success: true});
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
    if (req.user.google) val.g_photo = req.user.google.photo;
    if (req.user.facebook) val.f_photo = req.user.facebook.photo;
    val.desc = req.user.desc;
    res.json(val);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user || !user.active)
      return res.status(404).json({ msg: "No such user found" });
    res.json({
      _id: user._id,
      username: user.username,
      google: user.google,
      facebook: user.facebook,
      desc: user.desc,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
// exports.uploadProfilePic = (req, res, next) => {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     return res.status(200).send(req.file);
//   })
// }