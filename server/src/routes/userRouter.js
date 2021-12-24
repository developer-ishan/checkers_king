const {
  getMySummary,
  getUserByUsername,
  getUserById,
  deleteUser,
  updateUser,
  uploadProfilePic,
  getNotFriendsByUserName,
} = require("../controllers/userController");
const validator = require("../middleware/validator");
const isVerified = require("../middleware/isVerified");
const userAuth = require("../middleware/userAuth");
const userRouter = require("express").Router();
const { check } = require("express-validator");
const { filterPhoto } = require("../helpers/photoHelper");
userRouter
  .route("/")
  .get(userAuth, isVerified, async (req, res, next) => {
    req.user.photo = filterPhoto(req.user);
    return res.json(req.user);
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
userRouter.post("/dp", userAuth, isVerified, uploadProfilePic);
userRouter.get("/summary/:userId", getUserById);
userRouter.get("/search", getUserByUsername);
userRouter.get(
  "/search_not_friends",
  userAuth,
  isVerified,
  getNotFriendsByUserName
);
module.exports = userRouter;
