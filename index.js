const express = require("express");
const app = express();
const ENV = process.env.PORT || 3000;
const server = app.listen(ENV);

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/game.html"));

const socket = require("socket.io");
const io = socket(server);

io.sockets.on("connection", (socket) => {
  // console.log(socket.id);

  socket.on("roomJoined", (id) => {
    if (
      io.sockets.adapter.rooms.get(id) == undefined ||
      io.sockets.adapter.rooms.get(id).size < 2
    ) {
      socket.emit("roomCapacity", false);
      console.log(`joined ${id}`, socket.id);
      socket.join(id);
      if (io.sockets.adapter.rooms.get(id).size === 1) {
        socket.emit("waiting");
      }
      console.log(io.sockets.adapter.rooms.get(id).size);
      socket.broadcast.to(id).emit("yourSymbol", "circle");
      socket.on("squareClicked", (data) => {
        console.log(data);
        socket.broadcast.to(id).emit("squareClicked", data);
      });
      socket.on("changeTurn", (turn) => {
        socket.broadcast.to(id).emit("changeTurn", turn);
      });
      socket.on("newGame", (boolean) => io.to(id).emit("newGame", boolean));

      socket.on("disconnect", () => socket.to(id).emit("opponentDisconnected"));
    } else {
      socket.emit("roomCapacity", true);
    }
  });
});
