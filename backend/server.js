require("dotenv/config");
const http = require("http"); // for socket io
const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");
const jwt = require("jsonwebtoken");
const socketio = require("socket.io");
const { use } = require("./routes/login");
const User = require("./modals/User").User;
const { joinUser, getCurrentUser } = require("./utils/loggedUsers");
const { join } = require("path");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
// kill node.exe pid : cmd "/C TASKKILL /IM node.exe /F"

mongo.connect(process.env.MONGO_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
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

    // someone just signed in in client side
    socket.on("newUserConnected", data => {
        const user = {
            id: socket.id,
            username: data.username
        };
        socket.join(user);

        socket.broadcast.emit('message', `${user.username} is now connected`);

        // refresh all existing users
        saveUserSocketId(user);
        refreshUsers(user, socket);

        // when user disconnects => removes active button
        socket.on("disconnect", () => {
            io.emit('message', `${user.username} is offline`);
        });
    });

    socket.on("newFriendRequest", data => {
        console.log(data);

        // from sender
        User.findOne({ username: data.from }, (err, user) => {
            user.requests_sent.push({ username: data.to });
            user.save();
            console.log(user);
        });

        // to wannabe friend
        User.findOne({ username: data.to }, (err, user) => {
            user.requests_received.push({ username: data.from });
            user.save();
            console.log(user);
        });
    })
});

async function saveUserSocketId(user) {
    await User.findOneAndUpdate({ username: user.username }, { socket_id: user.id });
}

async function refreshUsers(user, socket) {
    let array = [];
    let username, fullname, id;
    let people = {
        username,
        fullname,
        id
    };

    // send back everybodys username and fullname
    await User.find({}, async (err, users) => {
        if (err) {
            console.log(err);
            return;
        }

        for (let i = 0; i < users.length; i++) {
            people.username = users[i].username;
            people.fullname = users[i].fullname;
            people.id = users[i]._id;
            array.push(people);
            people = {};
        }

        io.emit("allUsers", array); // send to everyone
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