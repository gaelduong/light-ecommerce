const express = require("express");
const router = express.Router();
const { Product } = require("../models/");

router.get("/products", async (req, res) => {
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

module.exports = router;
