const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../config/keys");

const { sendRequest } = require("../../../helpers/friendHelpers");
const { filterPhoto } = require("../../../helpers/photoHelper");
const User = require("../../../models/User");
const {
  getUserDetailsWithToken,
  findOnlineUserById,
} = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  async ({ token, receiverId, text }, callback) => {
    console.log("got request for", { token, receiverId, text });
    var decodedId = jwt.verify(token, JWT_SECRET).sub;
    const sender = await User.findById(decodedId);
    await sendRequest(sender._id, receiverId, text);
    const receiver = await findOnlineUserById(receiverId);
    console.log("request related users:", receiver, sender);
    if (receiver) {
      io.to(receiver.id).emit("got-friend-request", {
        userId: sender._id,
        username: sender.username,
        photo: filterPhoto(sender),
        msg: text,
      });
    }
    return callback({
      msg: "Request Sent",
      status: true,
    });
  };
