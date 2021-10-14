const passport = require("passport");
const userAuth = passport.authenticate("jwt", { session: false });
module.exports = userAuth;