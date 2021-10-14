const authRouter = require("express").Router();
const { check } = require("express-validator");
const passport = require("passport");
const authController = require("../controllers/authController");
const validator = require("../middleware/validator");
const userAuth = require("../middleware/userAuth");

authRouter.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Invalid Email..."),
    check("password").isLength({ min: 8 }).withMessage("Password too short..."),
  ],
  validator,
  authController.signUp
);

authRouter.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Email field required..."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password field required..."),
  ],
  validator,
  (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
      if (err || !user)
        return res
          .status(401)
          .json({ success: false, err: "email and password does not match" });
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.signInSendToken
);

authRouter.get("/signout", userAuth, authController.signOut);

authRouter.get(
  "/oauth/google",
  passport.authenticate("google", { session: false })
);
authRouter.get(
  "/oauth/google/callback",
  passport.authenticate("google", {
    session: false,
    assignProperty: "profile",
  }),
  authController.googleOAuth,
  authController.signInSendCookie
);

authRouter.get(
  "/oauth/facebook",
  passport.authenticate("facebookToken", { session: false }),
  authController.facebookOAuth,
);
authRouter.get(
  "/oauth/facebook/callback",
  passport.authenticate("facebookToken", {
    session: false,
    assignProperty: 'profile',
  }),
  authController.facebookOAuth,
  authController.signInSendCookie
);

authRouter.get("/dashboard", userAuth, authController.dashboard);

authRouter.get("/status", userAuth, authController.checkAuth);

module.exports = authRouter;
