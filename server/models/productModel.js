const mongoose = require("mongoose");

// Image schema
const imageSchema = new mongoose.Schema({
   order: { type: Number, required: true },
   path: { type: String, required: true }
});

// Price variation schemas
const variationPriceListSchema = new mongoose.Schema({
   options: { type: [String], required: true },
   price: { type: Number, required: true }
});

const variationSchema = new mongoose.Schema({
   name: { type: String, required: true },
   values: { type: [String], required: true }
});

const priceVariationSchema = new mongoose.Schema({
   variations: { type: [variationSchema], required: true },
   variationPriceList: { type: [variationPriceListSchema], required: true }
});

const priceOptions = new mongoose.Schema({
   singlePrice: { type: Number, default: null },
   multiplePrices: { type: priceVariationSchema, default: null }
});

// Product schema
const productSchema = new mongoose.Schema({
   name: { type: String, required: true },
   // price: { type: Number, required: true },
   price: { type: priceOptions, required: true },
   description: { type: String },
   category: { type: String, required: true },
   isInStock: { type: Boolean, required: true },
   images: { type: [imageSchema] }
});

// Product model
const Product = mongoose.model("products", productSchema);

module.exports = Product;
