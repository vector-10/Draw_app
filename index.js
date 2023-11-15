const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        // Allow cross origin resource sharing for front end resource
        origin: "http://localhost:5173", 
        AccessControlAllowOrigin: "http://localhost:5173",
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
       },
});

io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`);

    socket.on('draw', (data) => {
        //broadcasting the drawing to toher clients
        socket.broadcast.emit('draw', data)
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected with ID ${socket.id}`);
    });

})


app.get("/", (req, res) => {
    res.json({
        message: "Successfully connected to the Server"
    })
});
const PORT = 4000 || process.env.PORT;
server.listen(PORT, ()=> {
    console.log(` server is listening on port ${PORT}`);
})