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
    let usernamesArray = [];

    User.find({}, (err, user) => {
        user.forEach(person => {
            if (person.username != decodedUser.username) {
                usernamesArray.push(person.username);
            }
        })
        res.json(usernamesArray);
    })
});

module.exports = router;