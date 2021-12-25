const User = require("../models/User");
exports.getLeaderBoard = async (req, res, next) => {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      msg: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  query.sort = {
    rating: -1,
  };
  // Find some documents
  User.count({}, function (err, totalCount) {
    if (err) {
      response = { success: false, msg: "Error fetching data" };
    }
    User.find({}, {}, query, function (err, data) {
      // Mongo command to fetch all data from collection.
      if (err) {
        response = { success: false, msg: "Error fetching data" };
      } else {
        var totalPages = Math.ceil(totalCount / size);
        response = { success: true, data: data, pages: totalPages };
      }
      res.json(response);
    });
  });
};
