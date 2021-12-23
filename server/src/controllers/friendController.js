const { filterPhoto } = require("../helpers/photoHelper");
const User = require("../models/User");
exports.getMyFriends = async (req, res, next) => {
  req.user
    .populate({
      path: "friends.user",
      select: "username photo rating google facebook",
    })
    .exec((err, populated) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      const friends = req.user.friends.map((friend) => {
        const ret = {};
        ret.userId = friend._id;
        ret.username = friend.username;
        ret.photo = filterPhoto(friend);
        return ret;
      });
      res.json(friends.filter((friend) => friend.status == "ACCEPTED"));
    });
};

exports.getMyFriendRequests = (req, res, next) => {
  User.findOne({_id: req.user._id})
    .populate({
      path: "friends.user",
      select: "username photo rating google facebook",
    })
    .exec((err, populated) => {
      console.log(populated);
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      const friends = populated.friends.map((friend) => {
        const ret = {};
        ret.userId = friend.user._id;
        ret.username = friend.user.username;
        ret.photo = filterPhoto(friend.user);
        ret.status = friend.status
        return ret;
      });
      res.json(friends.filter((friend) => friend.status == "NEW" || friend.status == "SEEN"));
    });
};
