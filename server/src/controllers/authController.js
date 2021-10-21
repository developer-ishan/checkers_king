const JWT = require("jsonwebtoken");
const User = require("../models/User");
const {
  JWT_SECRET,
  VERIFICATION_JWT_SECRET,
  UI_BASE,
  SERVER_BASE,
} = require("../config/keys");
const { transporter, mailOptions } = require("../config/mailer");

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

signVerificationToken = (user) => {
  return JWT.sign(
    {
      iss: "Checkers_King",
      sub: user._id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    VERIFICATION_JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.body;

    // Check if there is a user with the same email
    let foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res.status(403).json({ err: "Email is already in use" });
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
      const savedUser = await foundUser.save();
      // Generate the token
      const token = signVerificationToken(savedUser);

      //mail the verification link
      transporter.sendMail(
        {
          from: "checkersking8@gmail.com",
          to: email,
          subject: "Verification Mail",
          html: `
            <h1>Welcome to the amazing world of checkers</h1>
            <a target="_blank" href='${SERVER_BASE}/api/auth/verify?verificationToken=${token}'>Verification Link</a>
            <p>If above link does not work: ${SERVER_BASE}/api/auth/verify?verificationToken=${token}</p>
          `,
          text: `If above link does not work: ${SERVER_BASE}/api/auth/verify?verificationToken=${token}`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            // Respond with token
            console.log("Email sent: " + info.response);
            return res.status(200).json({
              success: true,
              msg: "user saved and mail sent successfully!!",
            });
          }
        }
      );
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
    const token = signVerificationToken(newUser);
    transporter.sendMail(
      {
        from: "checkersking8@gmail.com",
        to: email,
        subject: "Verification Mail",
        html: `
          <h1>Welcome to the amazing world of checkers</h1>
          <a target="_blank" href='${SERVER_BASE}/api/auth/verify?verificationToken=${token}'>Verification Link</a>
          <p>If above link does not work: ${SERVER_BASE}/api/auth/verify?verificationToken=${token}</p>
        `,
        text: `If above link does not work: ${SERVER_BASE}/api/auth/verify?verificationToken=${token}`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          // Respond with token
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            success: true,
            msg: "user saved and mail sent successfully!!",
          });
        }
      }
    );
  },

  resendMail: async (req, res, next) => {
    const user = await User.findOne({ "local.email": req.body.email });
    if (!user) {
      return res.send(404).json({
        success: false,
        msg: "No account found for the given email",
      });
    }
    if (user.isVerified) return res.send("Email already verified");
    // Generate the token
    const token = signVerificationToken(user);

    //mail the verification link
    transporter.sendMail(
      {
        from: "checkersking8@gmail.com",
        to: email,
        subject: "Resend Verification Mail",
        html: `
          <h1>Welcome to the amazing world of checkers</h1>
          <a target="_blank" href='${SERVER_BASE}/api/auth/verify?verificationToken=${token}'>Verification Link</a>
          <p>If above link does not work: ${SERVER_BASE}/api/auth/verify?verificationToken=${token}</p>
        `,
        text: `If above link does not work: ${SERVER_BASE}/api/auth/verify?verificationToken=${token}`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          // Respond with token
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            success: true,
            msg: "user saved and mail sent successfully!!",
          });
        }
      }
    );

    return res.send(404).json({
      success: false,
      msg: "No account found for the given email",
    });
  },

  verifyMail: async (req, res, next) => {
    req.user.isVerified = true;
    await req.user.save();
    return res.send(
      "Email Verified Successfully, you can close the window now"
    );
  },
  signInSendCookie: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    let options = {
      maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 30 days
      httpOnly: false, // The cookie only accessible by the web server
      signed: false, // Indicates if the cookie should be signed
    };

    // Set cookie
    res.cookie("token", token, options); // options is optional
    res.cookie("userId", req.user._id.toString(), options); // options is optional
    res.redirect(UI_BASE);
  },
  signInSendToken: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({
      success: true,
      caution: "set the token in cookie for uniformity",
      token: token,
      userId: req.user._id,
    });
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
        isVerified: true,
      });

      req.user = await newUser.save();
      return next();
    }
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    // Could get accessed in two ways:
    // 1) When registering for the first time
    // 2) When linking account to the existing one
    const { profile } = req;
    if (req.user) {
      // We're already logged in, time for linking account!
      // Add Google's data to an existing account
      req.user.methods.push("facebook");
      req.user.facebook = {
        id: profile.id,
        name: profile.name,
        photo: profile.photos[0].value,
      };
      req.user = await req.user.save();
      return next();
    } else {
      // We're in the account creation process
      let existingUser = await User.findOne({ "facebook.id": profile.id });
      if (existingUser) {
        req.user = existingUser;
        return next();
      }

      // Check if we have someone with the same email
      if (profile.emails)
        existingUser = await User.findOne({
          "local.email": profile.emails[0].value,
        });
      if (existingUser) {
        // We want to merge google's data with local auth
        existingUser.methods.push("facebook");
        existingUser.facebook = {
          id: profile.id,
          name: profile.name,
          photo: profile.photos[0].value,
        };
        req.user = await existingUser.save();
        return next();
      }

      const newUser = new User({
        methods: ["facebook"],
        facebook: {
          id: profile.id,
          name: profile.name,
          photo: profile.photos[0].value,
        },
        isVerified: true,
      });

      req.user = await newUser.save();
      return next();
    }
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
