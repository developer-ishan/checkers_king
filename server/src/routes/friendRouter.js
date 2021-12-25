const {
  getMyFriends,
  getMyFriendRequests,
  getMySentRequests,
  getFriendShipStatus
} = require("../controllers/friendController");
const userAuth = require("../middleware/userAuth");
const isVerified = require("../middleware/isVerified");

const friendRouter = require("express").Router();

friendRouter.get("/", userAuth, isVerified, getMyFriends);
friendRouter.get("/requests", userAuth, isVerified, getMyFriendRequests);
friendRouter.get("/requestssent", userAuth, isVerified, getMySentRequests);
friendRouter.get("/status/:userId", userAuth, isVerified, getFriendShipStatus);

module.exports = friendRouter;
