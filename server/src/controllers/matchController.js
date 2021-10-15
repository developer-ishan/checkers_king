const Match = require("../models/Match");

exports.getMyMatches = async (id) => {
  try {
    const userId = id;
    console.log(userId);
    console.log(userId.toString());
    const matches = await Match.aggregate([
      {
        $match: {
          $or: [
            { "players.0.userId": userId.toString() },
            { "players.1.userId": userId.toString() },
          ],
        },
      },
    ]);
    // if (!matches)
    //   return res
    //     .status(404)
    //     .json({ success: false, msg: "No Matches Found!!" });
    console.log(matches);
    return matches;
  } catch (err) {
    console.log(err);
    return null;
  }
};
