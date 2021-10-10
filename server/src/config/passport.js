const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");

const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const keys = require("./keys");
const User = require("../models/User");
// JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: keys.JWT_SECRET,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        // Find the user specified in token
        const user = await User.findById(payload.sub);

        // If user doesn't exists, handle it
        if (!user) {
          return done(null, false);
        }

        // Otherwise, return the user
        req.user = user;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.oauth.google.clientID,
      clientSecret: keys.oauth.google.clientSecret,
      callbackURL: "/api/auth/oauth/google/callback",
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

passport.use(
  "facebookToken",
  new FacebookStrategy(
    {
      clientID: keys.oauth.facebook.clientID,
      clientSecret: keys.oauth.facebook.clientSecret,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        if (req.user) {
          // We're already logged in, time for linking account!
          // Add Facebook's data to an existing account
          req.user.methods.push("facebook");
          req.user.facebook = {
            id: profile.id,
            email: profile.emails[0].value,
          };
          await req.user.save();
          return done(null, req.user);
        } else {
          // We're in the account creation process
          let existingUser = await User.findOne({ "facebook.id": profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          // Check if we have someone with the same email
          existingUser = await User.findOne({
            "local.email": profile.emails[0].value,
          });
          if (existingUser) {
            // We want to merge facebook's data with local auth
            existingUser.methods.push("facebook");
            existingUser.facebook = {
              id: profile.id,
              email: profile.emails[0].value,
            };
            await existingUser.save();
            return done(null, existingUser);
          }

          const newUser = new User({
            methods: ["facebook"],
            facebook: {
              id: profile.id,
              email: profile.emails[0].value,
            },
          });

          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

// LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await User.findOne({ "local.email": email });

        // If not, handle it
        if (!user) {
          return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
