const mongo = require("mongoose");

const UserSchema = new mongo.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        min: 6,
    },
    fullname: {
        type: String,
        required: true,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    dateAccCreated: {
        type: Date,
        default: Date.now,
    },
    friends: [
        {
            username: { type: String },
            dateAdded: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

let User = mongo.model("User", UserSchema);
module.exports = { User: User };