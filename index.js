const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

// cant use find as find returns the value we need Boolean
function addUser(userid, socketid) {
  if (!users.some((u) => u.userid === userid || u.socketid === socketid)) {
    users.push({ userid, socketid });
  }
}
function removeUser(socketid) {
  users = users.filter((u) => u.socketid !== socketid);
}

io.on("connection", (socket) => {
  console.log("a user connected");
  //USER CONNECTION
  io.emit("welcome", "Hello this is socket server");
  //   io.emit(event,message)
  //USER ADDITION TO ALL USERS LIST
  socket.on("addUser", (userid) => {
    addUser(userid, socket.id);
    io.emit("getUsers", users);
  });
  //SENDING AND GETTING OF MESSAGES
  socket.on("sendMessage", ({ senderid, receiverid, text }) => {
    const receivingUser = users.find((u) => u.userid === receiverid);
    if (receivingUser) {
      io.to(receivingUser.socketid).emit("getMessage", {
        sender: senderid,
        text,
      });
    }
  });

  //REMOVING USER FROM ALL USERS LIST ON DISCONNECT / DISCONNECT IS KEYWORD
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

//SOCKET.ON for taking events on both server and client

//SOCKET SERVER ((use io ALWAYS))
// -> Send event to everyone -> use io.emit
// -> Send to one client -> io.to(socketID).emit

//CLIENT SERVER ((use socket ALWAYS))
// -> Send event to server -> socket.emit
// -> Take event from server -> socket.on

// on emits we can send values, on taking events wiht .on we can have a callback function
