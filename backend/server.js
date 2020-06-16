require("dotenv/config");
const http = require("http"); // for socket io
const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");
const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const { use } = require("./routes/login");
const User = require("./modals/User").User;

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

/* run when client connects 
   3 ways to communicate: socket.emit, broadcast.emit, io.emit

    emit: send msg to single/current connected client
    broadcast: emit to everybody except the user connected
    io.emit : to everybody
*/
io.on("connection", socket => {
    let username;

    // send msg to single/current connected client
    socket.emit('message', 'Welcome to chatcord');

    // when user connects => show active button
    // socket.broadcast.emit('message', 'user connected');

    // someone just signed in in client side
    socket.on("newUserConnected", data => {
        let decodedUser = jwt.verify(data.token, process.env.JWT_TOKEN);
        username = decodedUser.username;

        socket.broadcast.emit('message', `${username} is now connected`);

        // refresh all existing users
        refreshUsers(socket, username);


        // when user disconnects => removes active button
        socket.on("disconnect", () => {
            io.emit('message', `${username} is offline`);
        });
    });
});

function refreshUsers(socket, currentUsername) {
    let username, fullname;
    let people = {
        username,
        fullname
    };
    let array = [];

    // send back everybodys username and fullname
    User.find({}, (err, user) => {
        for (let i = 0; i < user.length; i++) {
            if (user[i].username != currentUsername) {
                people.username = user[i].username;
                people.fullname = user[i].fullname;
                array.push(people);
                people = {};
            }
        }
        // res.json(array);
        socket.emit("allUsers", array);
    });
}

// HOME routes
app.get("/home/mydata", (req, res) => {
    let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_TOKEN);
    // console.log(decodedUser);
});

app.post("/home/request", (req, res) => {
    let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_TOKEN);

    // finding friend
    User.find({ username: req.body.username }, (err, user) => {
        if (err) res.json(err);

        // find myself
        User.findById(decodedUser._id, (err, me) => {
            if (err) res.json(err);

            const friend = {
                username: me.username,
                fullname: me.fullname
            };

            // user.friend_request.push(friend);
            console.log(user.friend_request);
            res.json("friend added");
        });
    });
});


server.listen(PORT, () => console.log(`listening on port ${PORT}`));