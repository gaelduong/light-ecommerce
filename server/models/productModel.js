const mongoose = require("mongoose");

//Subschema schema
const imageSchema = new mongoose.Schema({
   order: { type: Number, required: true },
   path: { type: String, required: true }
});

// Product schema
const productSchema = new mongoose.Schema({
   name: { type: String, required: true },
   price: { type: Number, required: true },
   description: { type: String },
   category: { type: String, required: true },
   isInStock: { type: Boolean, required: true },
   images: { type: [imageSchema] }
});

// Product model
const Product = mongoose.model("products", productSchema);

module.exports = Product;
