const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../config/keys");
const { filterPhoto } = require("../../helpers/photoHelper");

var users = [];

// getting the user details with token
const getUserDetailsWithToken = async (token) => {
  if (token.startsWith("guest")) {
    return {
      userId: token,
      username: token,
      isGuest: true,
      photo: "default.png",
    };
  } else if (token) {
    try {
      var decodedId = jwt.verify(token, JWT_SECRET).sub;
      const userProfile = await User.findById(decodedId);
      if(!userProfile)
        return null;
      return {
        userId: userProfile.id,
        username: userProfile.username,
        photo: filterPhoto(userProfile),
        isGuest: false,
      };
    } catch (err) {
      console.log(err);
    }
  } else {
    return null;
  }
};

const findOnlineUserBySocketId = (socketId) => {
  return users.find((user) => user.id === socketId);
};

const findOnlineUserById = (userId) => {
  return users.find((user) => user.userId === userId);
};

const isUserAlreadyOnline = (userId) => {
  const existingUser = findOnlineUserById(userId);
  return existingUser !== undefined;
};

const addUserToList = async (socket, token) => {
  const userDetails = await getUserDetailsWithToken(token);
  if (userDetails && isUserAlreadyOnline(userDetails.userId)) return false;
  const { userId, username, isGuest, photo } = userDetails;
  users.push({ userId, username, photo, isGuest, id: socket.id });
  return { userId, username, photo, isGuest, id: socket.id };
};

const removeUserFromList = (socketId) => {
  const user = findOnlineUserBySocketId(socketId);
  if (user) users.splice(users.indexOf(user), 1);
};
const getOnlineFriends = async (userId) => {
  User.findOne({_id: userId, "friends": { "$in": users }})
    .populate({
      path: "friends.user",
      select: "username photo rating google facebook",
    })
    .exec((err, populated) => {
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
      res.json(friends.filter((friend) => friend.status == "ACCEPTED"));
    });
};
module.exports = {
  getUserDetailsWithToken,
  addUserToList,
  removeUserFromList,
  findOnlineUserById,
  getOnlineFriends,
};
