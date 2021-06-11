const mongoose = require("mongoose");

// Product schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Product model
const Product = mongoose.model("products", productSchema);

module.exports = Product;
