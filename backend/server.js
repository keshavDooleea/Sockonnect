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
        getRemainingUsers(user.username, socket);

        // when user disconnects => removes active button
        socket.on("disconnect", () => {
            io.emit('message', `${user.username} is offline`);
        });
    });

    socket.on("newFriendRequest", async data => {
        console.log(data);

        // from sender
        await User.findOne({ username: data.from }, (err, user) => {
            user.requests_sent.push({ username: data.to });
            user.save();
        });

        // to wannabe friend
        await User.findOne({ username: data.to }, (err, user) => {
            user.requests_received.push({ username: data.from });
            user.save();
        });

        getRemainingUsers(data.from, socket);
    })
});

async function saveUserSocketId(user) {
    await User.findOneAndUpdate({ username: user.username }, { socket_id: user.id });
}

async function getRemainingUsers(username, socket) {
    // all users
    await User.find({}, async (err, users) => {

        let allUsers = [];
        for (let i = 0; i < users.length; i++) {
            allUsers.push(users[i].username);
        }

        // current user
        await User.findOne({ username: username }, (err, me) => {
            let addedFriends = [];
            for (let i = 0; i < me.requests_sent.length; i++) {
                addedFriends.push(me.requests_sent[i].username);
            }

            const availableUsers = allUsers.filter(function (x) {
                return addedFriends.indexOf(x) < 0;
            });

            socket.emit("allUsers", availableUsers); // send to everyone
        });
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