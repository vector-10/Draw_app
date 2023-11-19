// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const bodyParser = require('body-parser');

// const { Server } = require('socket.io');
// const io = new Server(server, {
//     cors: {
//         origin:[ "*", "http://localhost:5173"]
//     }
// })


// app.use(bodyParser.json());


// io.on("connection", (socket) => {
//   console.log(
//     `A connection has been made to the socket server with ID ${socket.id}`
//   );

//   socket.on("draw", (data) => {
//     // Log the drawing data when received
//     console.log("Drawing data received:", { data, senderSocketId: socket.id });

//     // to emit the broadcast to other clients
//     socket.broadcast.emit("draw", data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Socket disconnected with ID ${socket.id}`);
//   });
// });

// const PORT = process.env.PORT || 4000;

// server.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });






const express = require('express');
const cors = require('cors');
const app = express();
const PORT  = process.env.PORT || 4000

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {cors:{
    origin: 'http://localhost:5173',
    AccessControlAllowOrigin: 'http://localhost:5173',
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true
  }});

  let connections = []
  let elements;
  io.on('connect', (socket) => {
      connections.push(socket);

      console.log(`A connection has been made to the socket server with ID ${socket.id}`)
      
      socket.on('elements', (data) => {
        elements = data
          connections.forEach(con => {
              if (con.id !== socket.id) {
                  con.emit('servedElements', {elements})
              }
          })
      })
      
      socket.on('down', (data) => {
          connections.forEach(con => {
              if (con.id !== socket.id) {
                  con.emit('ondown', {x: data.x, y: data.y})
              }
          })
      })
  })
  

httpServer.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});

