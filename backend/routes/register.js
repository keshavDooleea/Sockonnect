const router = require("express").Router();
const User = require("../modals/User").User;

router.route("/").post((req, res) => {
    User.findOne({ username: req.body.username }, async (err, user) => {
        if (err) res.json(err);

        // no user found
        if (user == null) {
            try {
                const newUser = new User({
                    username: req.body.username,
                    fullname: req.body.fullname,
                    password: req.body.password
                });

                await newUser.save();
                res.json("OK");
            } catch (err) {
                res.json(err);
            }
        }

        // user exists in db
        else {
            res.json("EXISTS");
        }
    })
});

module.exports = router;