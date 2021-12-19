const {
  getMySummary,
  getUserByUsername,
  getUserById,
  deleteUser,
  updateUser,
  uploadProfilePic,
} = require("../controllers/userController");
const validator = require("../middleware/validator");
const isVerified = require("../middleware/isVerified");
const userAuth = require("../middleware/userAuth");
const userRouter = require("express").Router();
const { check } = require("express-validator");
userRouter
  .route("/")
  .get(userAuth, isVerified, async (req, res, next) => {
    if (req.user.photo) {
    } else if (req.user.facebook) {
      req.user.photo = req.user.facebook.photo;
    } else if (req.user.google) {
      req.user.photo = req.user.google.photo;
    }
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
module.exports = userRouter;
