const express = require("express");
const app = express();
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);
const bodyParser = require("body-parser");

//middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "*"],
  })
);

//logic for the chat server
io.on("connection", (socket) => {
    console.log(`A user connected to the drawing app`);
})

const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
