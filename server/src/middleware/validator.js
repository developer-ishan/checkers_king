const { validationResult } = require("express-validator");

// Error Handler For Handling Checks On Fields From Express Validator
module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      err: errors.array(),
      success: false,
    });
  }

  next();
};
