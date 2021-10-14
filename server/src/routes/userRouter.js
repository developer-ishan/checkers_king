const {
  getMySummary,
  getUserById,
  deleteUser,
} = require("../controllers/userController");
const userAuth = require("../middleware/userAuth");
const userRouter = require("express").Router();

userRouter
  .route("/")
  .get(userAuth, async (req, res, next) => {res.json(req.user)})
  .post(userAuth, async (req, res, next) => {})
  .put(userAuth, async (req, res, next) => {})
  .delete(userAuth, deleteUser);
userRouter.get("/summary", userAuth, getMySummary);
userRouter.get("/summary/:userId", getUserById);
module.exports = userRouter;
