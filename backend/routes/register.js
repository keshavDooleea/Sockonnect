const router = require("express").Router();
const User = require("../modals/User").User;

router.route("/").post((req, res) => {

    console.log(req.body);

    User.findOne({ username: req.body.username }, async (err, user) => {
        console.log("DED");
        if (err) res.json("error");

        // no user found
        if (user == null) {
            const newUser = new User({
                username: req.body.username,
                fullname: req.body.fullname,
                password: req.body.password
            });

            await newUser.save();
            console.log("new user!")
            res.json("OK");
        }

        // user exists in db
        else {
            console.log("username exists!")
            res.json("EXISTS");
        }
    })
});

module.exports = router;