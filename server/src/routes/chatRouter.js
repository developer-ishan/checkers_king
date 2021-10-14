const { getMyChats } = require('../controllers/chatController');
const userAuth = require('../middleware/userAuth');

const chatRouter = require('express').Router();

chatRouter.get("/:matchId", userAuth, getMyChats);

module.exports = chatRouter;