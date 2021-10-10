const JWT = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/keys");

signToken = (user) => {
  return JWT.sign(
    {
      iss: "Checkers_King",
      sub: user._id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.body;

    // Check if there is a user with the same email
    let foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res.status(403).json({ error: "Email is already in use" });
    }

    // Is there a Google account with the same email?
    foundUser = await User.findOne({
      $or: [{ "google.email": email }, { "facebook.email": email }],
    });
    if (foundUser) {
      // Let's merge them?
      foundUser.methods.push("local");
      foundUser.local = {
        email: email,
        password: password,
      };
      await foundUser.save();
      // Generate the token
      const token = signToken(foundUser);
      // Respond with token
      return res.status(200).json({ success: true, token: token });
    }

    // Create a new user
    const newUser = new User({
      methods: ["local"],
      local: {
        email: email,
        password: password,
      },
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    res.status(200).json({ success: true, token: token });
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ success: true, token: token });
  },

  signOut: async (req, res, next) => {
    res.clearCookie("access_token");
    res.json({ success: true });
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    // Could get accessed in two ways:
    // 1) When registering for the first time
    // 2) When linking account to the existing one
    const { profile } = req;
    if (req.user) {
      // We're already logged in, time for linking account!
      // Add Google's data to an existing account
      req.user.methods.push("google");
      req.user.google = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.name,
        photo: profile.photos[0].value,
      };
       req.user = await req.user.save();
       return next();
    } else {
      // We're in the account creation process
      let existingUser = await User.findOne({ "google.id": profile.id });
      if (existingUser) {
         req.user = existingUser;
         return next();
      }

      // Check if we have someone with the same email
      existingUser = await User.findOne({
        "local.email": profile.emails[0].value,
      });
      if (existingUser) {
        // We want to merge google's data with local auth
        existingUser.methods.push("google");
        existingUser.google = {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.name,
          photo: profile.photos[0].value,
        };
         req.user = await existingUser.save();
         return next();
      }

      const newUser = new User({
        methods: ["google"],
        google: {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.name,
          photo: profile.photos[0].value,
        },
      });

       req.user = await newUser.save();
       return next();
    }
  },

  linkGoogle: async (req, res, next) => {
    res.json({
      success: true,
      methods: req.user.methods,
      message: "Successfully linked account with Google",
    });
  },

  unlinkGoogle: async (req, res, next) => {
    // Delete Google sub-object
    if (req.user.google) {
      req.user.google = undefined;
    }
    // Remove 'google' from methods array
    const googleStrPos = req.user.methods.indexOf("google");
    if (googleStrPos >= 0) {
      req.user.methods.splice(googleStrPos, 1);
    }
    await req.user.save();

    // Return something?
    res.json({
      success: true,
      methods: req.user.methods,
      message: "Successfully unlinked account from Google",
    });
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ success: true, token: token });
  },

  linkFacebook: async (req, res, next) => {
    res.json({
      success: true,
      methods: req.user.methods,
      message: "Successfully linked account with Facebook",
    });
  },

  unlinkFacebook: async (req, res, next) => {
    // Delete Facebook sub-object
    if (req.user.facebook) {
      req.user.facebook = undefined;
    }
    // Remove 'facebook' from methods array
    const facebookStrPos = req.user.methods.indexOf("facebook");
    if (facebookStrPos >= 0) {
      req.user.methods.splice(facebookStrPos, 1);
    }
    await req.user.save();

    // Return something?
    res.json({
      success: true,
      methods: req.user.methods,
      message: "Successfully unlinked account from Facebook",
    });
  },

  dashboard: async (req, res, next) => {
    console.log("I managed to get here!");
    res.json({
      secret: "resource",
      methods: req.user.methods,
    });
  },

  checkAuth: async (req, res, next) => {
    console.log("I managed to get here!");
    res.json({ success: true });
  },
};
