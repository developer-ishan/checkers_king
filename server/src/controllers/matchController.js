const Match = require("../models/Match");

exports.getMyMatches = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const matches = await Match.find({ "players.userId": userId });
    if (!matches)
      return res
        .status(404)
        .json({ success: false, msg: "No Matches Found!!" });
    console.log(matches);
    return res.json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, success: false });
  }
};
