const {
  getMyFriends,
  getMyFriendRequests,
  getMySentRequests
} = require("../controllers/friendController");
const userAuth = require("../middleware/userAuth");
const isVerified = require("../middleware/isVerified");

const friendRouter = require("express").Router();

friendRouter.get("/", userAuth, isVerified, getMyFriends);
friendRouter.get("/requests", userAuth, isVerified, getMyFriendRequests);
friendRouter.get("/requestssent", userAuth, isVerified, getMySentRequests);

module.exports = friendRouter;
