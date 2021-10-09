exports.SocketServer = (io) => {
  console.log("socket server has started running...");

  io.on("connection", (socket) => {
    console.log("a user connected!");

    socket.on("disconnect", () => {
      console.log("a user disconnected!");
    });
  });
};
