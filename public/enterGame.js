const allRooms = document.getElementsByClassName("room-button");

for (let i = 0; i < allRooms.length; i++) {
  allRooms[i].addEventListener("click", () => {
    let id = allRooms[i].id;
    socket.emit("roomJoined", id);
    socket.on("roomCapacity", (isRoomFull) => {
      if (isRoomFull) {
        document.getElementById("error-full").style.display = "block";
        setTimeout(
          () => (document.getElementById("error-full").style.display = "none"),
          2000
        );
      } else {
        document.getElementById("homepage").style.display = "none";
        document.getElementById("game").style.display = "block";
      }
    });
  });
}
