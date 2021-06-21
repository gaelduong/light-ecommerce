const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { Product } = require("../models/");

router.get("/products", async (req, res) => {
   // Retrieve products from DB
   try {
      const products = await Product.find({});
      const newProducts = products.map((product) => {
         const productObj = product._doc;
         const imagePath = product.image;
         const doesImageExist = fs.existsSync(path.resolve(__dirname, `../${imagePath}`));
         if (imagePath && doesImageExist) {
            const imageAsBase64 = fs.readFileSync(path.resolve(__dirname, `../${imagePath}`), "base64");
            productObj.imageAsBase64 = "data:;base64," + imageAsBase64;
            return productObj;
         }
         return productObj;
      });
      // console.log(newProducts);
      res.json(newProducts);
      console.log("Retrieved successfully");
   } catch (error) {
      console.log(error);
      res.status(500);
   }
});

module.exports = router;
