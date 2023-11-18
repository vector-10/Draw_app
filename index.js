const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');

const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin:[ "*", "http://localhost:5173"]
    }
})


app.use(bodyParser.json());


io.on("connection", (socket) => {
  console.log(
    `A connection has been made to the socket server with ID ${socket.id}`
  );

  socket.on("draw", (data) => {
    // Log the drawing data when received
    console.log("Drawing data received:", { data, senderSocketId: socket.id });

    // to emit the broadcast to other clients
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected with ID ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
