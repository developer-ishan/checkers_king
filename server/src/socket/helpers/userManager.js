const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../config/keys");

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
      return {
        userId: userProfile.id,
        username: userProfile.username,
        photo: userProfile.photo,
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
  const { userId, username, isGuest } = userDetails;
  users.push({ userId, username, isGuest, id: socket.id });
  return true;
};

const removeUserFromList = (socketId) => {
  const user = findOnlineUserBySocketId(socketId);
  if (user) users.splice(users.indexOf(user), 1);
};

module.exports = {
  getUserDetailsWithToken,
  addUserToList,
  removeUserFromList,
};
