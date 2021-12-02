const mongoose = require("mongoose");
const User = require("./models/User.model");
const connection = "mongodb://mongo:27017/UsersDb";

const connectDb = () => {
    return mongoose.connect(connection).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));;
};

module.exports = connectDb;