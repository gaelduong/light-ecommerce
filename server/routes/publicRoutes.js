const express = require("express");
const router = express.Router();
const { getProducts } = require("./commonFunctions");

router.get("/products", getProducts);

module.exports = router;
