const Match = require("../models/Match");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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

    //the above matches array contains lots of data
    //so filtering it down to only required data
    let filteredData = [];
    matches.forEach((match) => {
      //creating an object of userId:ratingChange to refrence it later
      let ratingChange = {};
      match.players.forEach((player) => {
        ratingChange[player.userId] = player.delta;
      });

      //filtering player info
      let playersInfo = [];
      match.details.forEach((detail) => {
        const { _id, username, rating } = detail;
        let player = {
          id: _id,
          userName: username,
          rating: rating,
          ratingChange: ratingChange[_id], //here we are using the above created ratingChange object
          profileUrl:
            "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png",
        };
        if ("google" in detail) {
          player["profileUrl"] = detail.google.profileUrl;
        } else if ("facebook" in detail) {
          if (detail.facebook.photo)
            player["profileUrl"] = detail.facebook.photo;
        }
        playersInfo.push(player);
      });

      const { _id } = match;
      //this _id is actullay the id of the db object
      //not the id which was shared between friends
      filteredData.push({ matchId: _id, players: playersInfo });
    });
    console.log("all matches by this user", matches);
    return res.json(filteredData);
  } catch (err) {
    return res.status(404).json({
      success: false,
      msg: "no such match found",
      err: err,
    });
  }
};

exports.getMatchById = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const matches = await Match.aggregate([
      {
        $match: { _id: ObjectId(matchId) },
      },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          players: 1,
          moves: 1,
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

    if (!matches || matches.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: "No Matches Found!!" });
    return res.json(matches[0]);
  } catch (err) {
    return res.status(404).json({
      success: false,
      msg: "no such match found",
      err: err,
    });
  }
};
