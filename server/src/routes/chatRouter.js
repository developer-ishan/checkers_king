const { getMyChats } = require("../controllers/chatController");
const userAuth = require("../middleware/userAuth");
const isVerified = require("../middleware/isVerified");

const chatRouter = require("express").Router();

chatRouter.get("/:matchId", userAuth, isVerified, getMyChats);

module.exports = chatRouter;
