const mongoose = require("mongoose");

// Product schema
const productSchema = new mongoose.Schema({
   name: { type: String, required: true },
   price: { type: Number, required: true },
   description: { type: String },
   category: { type: String, required: true },
   isInStock: { type: Boolean, required: true },
   image: { type: String }
});

// Product model
const Product = mongoose.model("products", productSchema);

module.exports = Product;
