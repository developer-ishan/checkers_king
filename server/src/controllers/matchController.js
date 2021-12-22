const Match = require("../models/Match");
const mongoose = require("mongoose");
const keys = require("../config/keys");
const { filterPhoto } = require("../helpers/photoHelper");
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
      {
        $sort: {
          startTime: -1,
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
          photo: keys.SERVER_BASE + "/public/dp/default.png",
        };
        if (detail.photo)
          player.photo = keys.SERVER_BASE + "/public/dp/" + detail.photo;
        else if ("google" in detail.methods) {
          player.photo = detail.google.photo;
        } else if ("facebook" in detail) {
          if (detail.facebook.photo) player.photo = detail.facebook.photo;
        }
        playersInfo.push(player);
      });

      const { _id } = match;
      //this _id is actullay the id of the db object
      //not the id which was shared between friends
      filteredData.push({ matchId: _id, players: playersInfo });
    });
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
        const { _id, username, rating, color } = detail;
        let player = {
          id: _id,
          userName: username,
          rating: rating,
          ratingChange: ratingChange[_id], //here we are using the above created ratingChange object
          photo: filterPhoto(detail),
          color: color
        };
        playersInfo.push(player);
      });

      const { _id } = match;
      //this _id is actullay the id of the db object
      //not the id which was shared between friends
      filteredData.push({
        matchId: _id,
        players: playersInfo,
        moves: match.moves,
        startTime: match.startTime,
        endTime: match.endTime,
      });
    });
    return res.json(filteredData[0]);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      msg: "no such match found",
      err: err,
    });
  }
};
