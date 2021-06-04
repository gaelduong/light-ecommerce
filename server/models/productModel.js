const mongoose = require("mongoose");

// Product schema
const productSchema = new mongoose.Schema({
    name: String
});

// Product model
const Product = mongoose.model("products", productSchema);

module.exports = Product;
