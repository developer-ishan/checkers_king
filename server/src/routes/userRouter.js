const {
  getMySummary,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const validator = require("../middleware/validator");
const userAuth = require("../middleware/userAuth");
const userRouter = require("express").Router();
const { check } = require("express-validator");
userRouter
  .route("/")
  .get(userAuth, async (req, res, next) => {
    res.json(req.user);
  })
  .put(
    [
      check("desc").exists().isString().withMessage("description is requierd"),
      check("username").exists().isString().withMessage("username is requierd"),
    ],
    validator,
    userAuth,
    updateUser
  )
  .delete(userAuth, deleteUser);
userRouter.get("/summary", userAuth, getMySummary);
userRouter.get("/summary/:userId", getUserById);
module.exports = userRouter;
