require("dotenv/config");
const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// kill node.exe pid : cmd "/C TASKKILL /IM node.exe /F"

// mongo
const User = require("./modals/User").User;

mongo.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to DB!");
});

app.post("/register", (req, res) => {
    console.log(req.body);
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));