const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./dbConfig");
const { Product, User } = require("./models/");
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cors());

dbConnect();

// Public routes
app.get("/products", async (req, res) => {
    // Retrieve products from DB
    try {
        const products = await Product.find({});
        console.log("Retrieved successfully");
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

// Private routes
app.get("/products_admin", async (req, res) => {
    // Retrieve products from DB
    try {
        const products = await Product.find({});
        console.log("Retrieved successfully");
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.post("/products_admin", async (req, res) => {
    const product = req.body;
    const newProduct = new Product(product);
    // Insert product to DB
    try {
        const addedProduct = await newProduct.save();
        console.log("Saved to DB successfully");
        res.json(addedProduct);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.delete("/products_admin/:id", async (req, res) => {
    try {
        const removedProduct = await Product.findById(req.params.id);
        removedProduct.remove();
        console.log("Delete from DB successfully");
        res.json(removedProduct);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

app.put("/products_admin/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const productToUpdate = await Product.findById(req.params.id);
        if (productToUpdate) {
            productToUpdate.name = name;
        }
        productToUpdate.save();
        res.json(productToUpdate);
    } catch (error) {
        console.log(error);
    }
});

// Authentication

app.post("/login", async (req, res) => {
    const user = await User.findOne({ name: "admin" });
    if (!user) {
        return res.sendStatus(403);
    }
    const hashedPassword = user.password;
    const passwordMatched = await bcrypt.compare("test123", hashedPassword);
    if (!passwordMatched) {
        return res.sendStatus(403);
    }
    return res.json({ name: user.name });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
