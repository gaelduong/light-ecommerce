const express = require("express");
const router = express.Router();
const { getProducts, getProductById, getSearchedProducts } = require("./commonFunctions");

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post("/search", getSearchedProducts);
module.exports = router;
