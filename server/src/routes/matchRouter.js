const { getMyMatches } = require("../controllers/matchController");
const userAuth = require("../middleware/userAuth");
const matchRouter = require("express").Router();

matchRouter.get("/:userId", userAuth, getMyMatches);

module.exports = matchRouter;
