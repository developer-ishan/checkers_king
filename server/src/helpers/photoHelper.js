const keys = require("../config/keys");

const filterPhoto = (user) => {
  if (user.photo) {
    return keys.SERVER_BASE + "/public/dp/" + user.photo;
  } else if (user.facebook && user.facebook.photo) {
    return user.facebook.photo;
  } else if (user.google && user.google.photo) {
    return user.google.photo;
  }
  return keys.SERVER_BASE + "/public/dp/default.png";
};
module.exports = { filterPhoto };
