require("dotenv").config();

var path = require("path");
var cors = require("cors");
var logger = require("morgan");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var { SocketServer } = require("./socket/server");
const keys = require("./config/keys");

const { instrument } = require("@socket.io/admin-ui");
const passport = require("passport");

require("./config/mongo");
require("./config/passport");
app.use(passport.initialize());

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy borwsers choke on 204 (IE11 & various SmartTVs)
  credentials: true,
};

/* TODO: Router Imports */
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "../public")));

/* TODO: Router Use */

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const matchRouter = require("./routes/matchRouter");
const friendRouter = require("./routes/friendRouter");
const gameRouter = require("./routes/gameRouter");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/match", matchRouter);
app.use("/api/friend", friendRouter);
app.use("/api/game", gameRouter);

// Catching 404 Not Found Error
app.use(function (req, res, next) {
  res.status(404);
  return res.json({
    error: `${req.method} on ${req.url} not found!!`,
    success: false,
  });
});

// Catching 500 Internal Server Error
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.message,
    success: false,
  });
});

const io = require("socket.io")(http, {
  transports: ["websocket"],
  cors: {
    origin: "*",
  },
});
instrument(io, {
  auth: false,
});
SocketServer(io);

var PORT = keys.PORT;
http.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
