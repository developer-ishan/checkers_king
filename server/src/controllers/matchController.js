const Match = require("../models/Match");

exports.getMyMatches = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const matches = await Match.aggregate([
      {
        $match: {
          $or: [
            { "players.0.userId": userId.toString() },
            { "players.1.userId": userId.toString() },
          ],
        },
      },
      {
        $project: {
          matchId: 1,
          startTime: 1,
          endTime: 1,
          players: 1,
          pids: {
            $map: {
              input: "$players",
              as: "id",
              in: { $toObjectId: "$$id.userId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "pids",
          foreignField: "_id",
          as: "details",
        },
      },
    ]);

    if (!matches)
      return res
        .status(404)
        .json({ success: false, msg: "No Matches Found!!" });
    console.log(matches);
    return res.json(matches);
  } catch (err) {
    console.log(err);
    return null;
  }
};
