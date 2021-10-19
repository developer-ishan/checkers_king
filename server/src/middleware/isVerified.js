const isVerified = (req, res, next) => {
  if(req.user.isVerified)
    return next();
  return res.status(401).json({
    success: false,
    msg: "Verify your email first"
  })
}
module.exports = isVerified;