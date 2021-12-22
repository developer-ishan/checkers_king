const Chat = require("../models/Chat");

exports.getMyChats = async (req, res, next) => {
  try {
    const matchId = req.params.matchId;
    const chat = await Chat.findOne({ match: matchId });
    if (!chat)
      return res.status(404).json({ success: false, msg: "Match not found" });
    console.log(chat.users);
    console.log(req.user._id.toString());
    return res.json(chat);
    // if (chat.users.includes(req.user._id.toString()))
    // return res.json(chat);
    // return res
    //   .status(401)
    //   .json({ success: false, msg: "No peeking in other people's DMs" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, success: false });
  }
};
