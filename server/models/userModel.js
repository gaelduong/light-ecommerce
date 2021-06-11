const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
});

// User model
const User = mongoose.model("users", userSchema);

module.exports = User;
