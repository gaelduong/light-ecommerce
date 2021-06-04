const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose.connect(process.env.DB_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error:"));
    db.once("open", () => {
        console.log("Connected to MongoDB");
    });
};

module.exports = {
    dbConnection
};
