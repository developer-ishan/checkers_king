const {
  getMySummary,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const validator = require("../middleware/validator");
const isVerified = require("../middleware/isVerified");
const userAuth = require("../middleware/userAuth");
const userRouter = require("express").Router();
const { check } = require("express-validator");
userRouter
  .route("/")
  .get(userAuth, isVerified, async (req, res, next) => {
    res.json(req.user);
  })
  .put(
    [
      check("desc").exists().isString().withMessage("description is requierd"),
      check("username").exists().isString().withMessage("username is requierd"),
    ],
    validator,
    userAuth,
    isVerified,
    updateUser
  )
  .delete(userAuth, isVerified, deleteUser);
userRouter.get("/summary", userAuth, isVerified, getMySummary);
userRouter.get("/summary/:userId", getUserById);
module.exports = userRouter;
