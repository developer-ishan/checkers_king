const {
  acceptRequest,
  rejectRequest,
} = require("../../../helpers/friendHelpers");
const jwt = require("jsonwebtoken");
const { filterPhoto } = require("../../../helpers/photoHelper");
const { JWT_SECRET } = require("../../../config/keys");
const User = require("../../../models/User");
const { findOnlineUserById } = require("../../helpers/userManager");

module.exports =
  ({ io, socket }) =>
  async ({ token, senderId, response }) => {
    if (!token)
      return callback({
        msg: "Get Authenticated first",
        status: false,
      });
    var decodedId = jwt.verify(token, JWT_SECRET).sub;
    const myInfo = await User.findById(decodedId);
    console.log("respond", { decodedId, senderId, response });
    if (response) {
      await acceptRequest(senderId, decodedId);
    } else {
      await rejectRequest(senderId, decodedId);
    }
    const ack_receiver = await findOnlineUserById(senderId);
    if (ack_receiver)
      io.to(ack_receiver.id).emit("ack-friend-request", {
        userId: myInfo._id,
        username: myInfo.username,
        photo: filterPhoto(myInfo),
        response: response,
      });
  };
