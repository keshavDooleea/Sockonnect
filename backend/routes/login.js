const router = require("express").Router();
const User = require("../modals/User").User;

router.route("/").post((req, res) => {
    console.log(req.body);
});

module.exports = router;