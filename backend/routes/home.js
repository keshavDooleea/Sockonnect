require("dotenv/config");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../modals/User").User;

router.route("/mydata").get((req, res) => {
    let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_TOKEN);
    // console.log(decodedUser);
});

router.route("/alldata").get((req, res) => {
    let decodedUser = jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_TOKEN);
    let username, fullname;
    let people = {
        username,
        fullname
    };
    let array = [];

    // send back everybodys username and fullname
    User.find({}, (err, user) => {
        for (let i = 0; i < user.length; i++) {
            if (user[i].username != decodedUser.username) {
                people.username = user[i].username;
                people.fullname = user[i].fullname;
                array.push(people);
                people = {};
            }
        }
        res.json(array);
    });
});

module.exports = router;