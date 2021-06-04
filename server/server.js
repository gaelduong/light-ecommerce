const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./dbConfig");
const { Product } = require("./models/");
app.use(express.json());
app.use(cors());

dbConnect();

const products = [{ name: "Apple" }, { name: "Orange" }, { name: "Banana" }];

app.get("/products", async (req, res) => {
    // Retrieve products from DB
    try {
        const products = await Product.find({});
        console.log("Retrieved successfully");
        res.json(products);
    } catch (error) {
        console.log(error);
    }
});

app.post("/products", async (req, res) => {
    const product = req.body;
    const newProduct = new Product(product);
    // Insert product to DB
    try {
        await newProduct.save();
        console.log("Saved to DB");
    } catch (error) {
        console.log(error);
    }
    res.send("Success");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
