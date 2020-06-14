const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
    console.log(req.body);
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));