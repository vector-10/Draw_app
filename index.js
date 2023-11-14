const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`);
})












app.get("/", (req, res) => {
    res.status.json({
        message: "Successfully connected to the Server"
    })
})

const PORT = 4000 || process.env.PORT;

server.listen(PORT, ()=> {
    console.log(` server is listening on port ${PORT}`);
})