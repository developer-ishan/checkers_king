const { filterPhoto } = require("../helpers/photoHelper");
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
      res.json(friends.filter((friend) => friend.status == "NEW" || friend.status == "SEEN"));
    });
};
