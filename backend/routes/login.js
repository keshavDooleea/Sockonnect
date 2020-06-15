const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../modals/User").User;

router.route("/").post(async (req, res) => {
    console.log(req.body);

    await User.findOne({ username: req.body.username }, (err, user) => {
        if (err) res.json(err);

        // user not found
        if (user == null) {
            res.json("USERNAME");
        }
        // user found
        else {
            // verify password
            User.findOne({ username: req.body.username, password: req.body.password }, (err, userFound) => {

                // incorrect password
                if (userFound == null) {
                    res.json("PASSWORD");
                }
                // user found
                else {
                    const loggedUser = {
                        _id: userFound._id,
                        username: userFound.username,
                        password: userFound.password,
                        dateAccCreated: userFound.dateAccCreated,
                        friends: userFound.friends
                    };

                    // generate jwt token
                    let token = jwt.sign(loggedUser, process.env.JWT_TOKEN, {});
                    res.json({
                        status: "OK",
                        token: token
                    });
                }
            });
        }
    });
});

module.exports = router;