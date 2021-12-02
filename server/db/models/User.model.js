const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    spotifyRefreshToken: {
        type: String
    },
    spotifyAccessToken: {
        type: String
    },
    redditRefreshToken: {
        type: String
    },
    githubRefreshToken: {
        type: String
    },
    githubAccessToken: {
        type: String
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;