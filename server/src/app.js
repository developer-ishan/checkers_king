require("dotenv").config();

var path = require("path");
var cors = require("cors");
var logger = require("morgan");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var { SocketServer } = require("./socket/server");
const keys = require("./config/keys");
const authRouter = require("./routes/authRouter");

require('./config/mongo');

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
app.use(express.static(path.join(__dirname + "../public")));

/* TODO: Router Use */

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.use('/api/auth', authRouter);

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
  res.status(err.status || 500);
  res.json({
    error: err.message,
    success: false,
  });
});

const io = require("socket.io")(http, {
  transports: ["websocket"],
});
SocketServer(io);

var PORT = keys.PORT;
http.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
