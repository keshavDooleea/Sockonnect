require("dotenv/config");
const http = require("http"); // for socket io
const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");
const socketio = require("socket.io");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
// kill node.exe pid : cmd "/C TASKKILL /IM node.exe /F"

mongo.connect(process.env.MONGO_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, () => {
    console.log("connected to DB!");
});

// middlewares
app.use('/login', require("./routes/login"));
app.use('/register', require("./routes/register"));
app.use('/home', require("./routes/home"));

// run when client connects 
io.on("connection", socket => {
    console.log("new websocket connection");

    // send msg to client
    socket.emit('message', 'Welcome to chatcord');
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));