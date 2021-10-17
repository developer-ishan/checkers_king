const { getMyMatches, getMatchById } = require("../controllers/matchController");
const userAuth = require("../middleware/userAuth");
const matchRouter = require("express").Router();

matchRouter.get("/:userId", getMyMatches);
matchRouter.get("/details/:matchId", getMatchById);

module.exports = matchRouter;
