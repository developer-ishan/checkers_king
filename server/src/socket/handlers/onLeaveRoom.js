module.exports =
  ({ io, socket }) =>
  ({ roomId }) => {
    console.log(socket.id + " caught leave room ", roomId);
    socket.leave(roomId);
  };
