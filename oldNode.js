const express = require("express");
const app = express();
const server = app.listen(3000);

app.use(express.static("public"));

const socket = require("socket.io");
const io = socket(server);
let numOfUsers = 0;

io.sockets.on("connection", (socket) => {
  numOfUsers++;
  console.log(numOfUsers);
  socket.broadcast.emit("yourSymbol", "circle");
  console.log(socket.id);
  socket.on("squareClicked", (data) => {
    console.log(data);
    socket.broadcast.emit("squareClicked", data);
  });

  socket.on("changeTurn", (turn) => {
    socket.broadcast.emit("changeTurn", turn);
  });

  socket.on("newGame", (boolean) => io.emit("newGame", boolean));
  socket.on("disconnect", () => {
    numOfUsers--;
    console.log(numOfUsers);
  });
});
