require("dotenv/config");
const express = require("express");
const cors = require("cors");
const mongo = require("mongoose");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
// kill node.exe pid : cmd "/C TASKKILL /IM node.exe /F"

mongo.connect(process.env.MONGO_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, () => {
    console.log("connected to DB!");
});

// middlewares
app.use('/login', require("./routes/login"));
app.use('/register', require("./routes/register"));
app.use('/home', require("./routes/home"));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));