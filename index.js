const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const socket = require("socket.io");
socket.users = [];
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const servered = require("./routes/servered");
var connection = [];
var users = [];

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use("/server", servered);

app.get("/", (req, res) => {
  res.send("hey home!").status(200);
});

app.post("/", (req, res) => {
  res.send("hey post!").status(200);
});

app.post("/getOnlineUsers", (req, res) => {
  res.json(users.length);
});

app.post("/getInfo/", (req, res) => {
  name = req.body.data;
  users.push(name);
  res.json({ receivedData: 1 });
});

const server = app.listen(port, () => {
  console.log(`Server at ${port}`);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Socket.io
const io = socket(server);
io.on("connection", socket => {
  console.log("Made Socket Connection!");
  connection.push(socket.id);
  console.log(connection);
  console.log(users);
  var latestUser = users[users.length - 1];

  socket.on("chat", data => {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", function() {
    let index = connection.indexOf(socket.id);
    connection.splice(index, 1);
    users.splice(index, 1);
    io.emit("user disconnected");
  });
});

module.exports = app;
