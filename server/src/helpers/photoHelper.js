const filterPhoto = (user) => {
  if (user.photo) {
    return keys.SERVER_BASE + "/public/dp/" + req.user.photo;
  } else if (req.user.facebook) {
    return req.user.facebook.photo;
  } else if (req.user.google) {
    return req.user.google.photo;
  }
  return keys.SERVER_BASE + "/public/dp/default.png";
};
