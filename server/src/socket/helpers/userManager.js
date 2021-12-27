const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../config/keys");
const { filterPhoto } = require("../../helpers/photoHelper");
const Friend = require("../../models/Friend");

var users = [];

// getting the userId from token
const getUserIdWithToken = (token) => {
  let userId = null;
  if (!token) userId;
  if (token.startsWith("guest")) return token;
  try {
    userId = jwt.verify(token, JWT_SECRET).sub;
    return userId;
  } catch (err) {
    console.log(err);
  }
  return userId;
};

// getting the user details with token
const getUserDetailsWithToken = async (token) => {
  if (token.startsWith("guest")) {
    // GUEST user
    return {
      userId: token,
      username: token,
      isGuest: true,
      photo: "http://localhost:3000/images/default.png",
      status: "IDLE",
    };
  } else if (token) {
    // REGISTERED user
    try {
      var decodedId = jwt.verify(token, JWT_SECRET).sub;
      const userProfile = await User.findById(decodedId);
      if (!userProfile) return null;
      return {
        userId: userProfile.id,
        username: userProfile.username,
        photo: filterPhoto(userProfile),
        isGuest: false,
        status: "IDLE",
      };
    } catch (err) {
      console.log(err);
    }
  } else {
    return null;
  }
};

// finding if a user with socketId is online
const findOnlineUserBySocketId = (socketId) => {
  return users.find((user) => user.id === socketId);
};

// finding if a user with userId is online
const findOnlineUserById = (userId) => {
  return users.find((user) => user.userId === userId);
};

const findOnlineUserByToken = (token) => {
  const userId = getUserIdWithToken(token);
  return findOnlineUserById(userId);
};

// checking if a user is already online
const isUserAlreadyOnline = (userId) => {
  const existingUser = findOnlineUserById(userId);
  return existingUser !== undefined;
};

// adding user to the list of online people on connect
const addUserToList = async (socket, token) => {
  if (isUserAlreadyOnline(getUserIdWithToken(token))) return false;
  try {
    const userDetails = await getUserDetailsWithToken(token);
    if (!userDetails) return userDetails;
    const { userId, username, isGuest, photo, status } = userDetails;
    users.push({ userId, username, photo, isGuest, id: socket.id, status });
    return { userId, username, photo, isGuest, id: socket.id, status };
  } catch (err) {
    console.log(err);
  }
};

// removing user to the list of online people on disconnect
const removeUserFromList = (socketId) => {
  const user = findOnlineUserBySocketId(socketId);
  if (user) users.splice(users.indexOf(user), 1);
  return user;
};

const getOnlineFriends = async (userId) => {
  const onlineUsers = users.filter((u) => !u.isGuest);
  const onlineUserIds = onlineUsers.map((u) => u.userId);
  const friends_doc = await Friend.find(
    { requester: userId, status: "FRIENDS", recipient: { $in: onlineUserIds } },
    "recipient"
  );
  const friends = [];
  friends_doc.forEach((f) => {
    user = findOnlineUserById(f.recipient.toString());
    friends.push(user);
  });
  return friends;
};

module.exports = {
  getUserDetailsWithToken,
  addUserToList,
  removeUserFromList,
  findOnlineUserById,
  getOnlineFriends,
  getUserIdWithToken,
  findOnlineUserByToken,
};
