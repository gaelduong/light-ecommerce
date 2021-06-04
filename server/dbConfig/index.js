const mongoose = require("mongoose");

const dbConnect = async () => {
    mongoose.connect(process.env.DB_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection;
    connection.on("error", console.error.bind(console, "Connection error:"));
    connection.once("open", () => {
        console.log("Connected to MongoDB");
    });
};

module.exports = dbConnect;
