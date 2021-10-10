const authRouter = require("express").Router();
const { check } = require("express-validator");
const passport = require("passport");
require("../config/passport");
const userController = require("../controllers/user");
const validator = require("../controllers/validator");
const passportJWT = passport.authenticate("jwt", { session: false });

authRouter.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Invalid Email..."),
    check("password").isLength({ min: 8 }).withMessage("Password too short..."),
  ],
  validator,
  userController.signUp
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
  userController.signIn
);

authRouter.get("/signout", passportJWT, userController.signOut);

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
  userController.googleOAuth,
  userController.signIn
);

authRouter.get(
  "/oauth/facebook",
  passport.authenticate("facebookToken", { session: false }),
  userController.facebookOAuth,
);
authRouter.get(
  "/oauth/facebook/callback",
  passport.authenticate("facebookToken", {
    session: false,
    assignProperty: 'profile',
  }),
  userController.facebookOAuth,
  userController.signIn
);

authRouter.get("/dashboard", passportJWT, userController.dashboard);

authRouter.get("/status", passportJWT, userController.checkAuth);

module.exports = authRouter;
