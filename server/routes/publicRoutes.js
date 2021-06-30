const express = require("express");
const router = express.Router();
const { getProducts, getProductById } = require("./commonFunctions");

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

module.exports = router;
