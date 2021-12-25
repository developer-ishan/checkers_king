const { getLeaderBoard } = require("../controllers/gameController");

const gameRouter = require("express").Router();

/**
 * /api/game/leaderboard?pageNo=1&size=10
*/
gameRouter.get("/leaderboard", getLeaderBoard);

module.exports = gameRouter;
