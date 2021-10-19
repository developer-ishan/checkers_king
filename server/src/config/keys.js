module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  VERIFICATION_JWT_SECRET: process.env.VERIFICATION_JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 9500,
  UI_BASE: process.env.UI_BASE,
  MAILER_PASS: process.env.MAILER_PASS,
  MAIL_ID:process.env.MAILER_ID,
  SERVER_BASE:process.env.SERVER_BASE,
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
    },
  },
};