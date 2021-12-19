const { getMyFriends } = require("../controllers/friendController");
const userAuth = require("../middleware/userAuth");
const isVerified = require("../middleware/isVerified");

const friendRouter = require("express").Router();

friendRouter.get("/", userAuth, isVerified, getMyFriends);

module.exports = friendRouter;
