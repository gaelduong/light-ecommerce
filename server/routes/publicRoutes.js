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
         const images = productObj.images;
         const imagesForClient = [];
         for (const image of images) {
            const imagePath = image.path;
            const doesImageExist = fs.existsSync(path.resolve(__dirname, `../${imagePath}`));
            if (imagePath && doesImageExist) {
               const imageAsBase64 = fs.readFileSync(path.resolve(__dirname, `../${imagePath}`), "base64");
               imagesForClient.push({ order: image.order, imageAsBase64: "data:;base64," + imageAsBase64 });
            }
         }
         productObj.images = imagesForClient;
         return productObj;
      });
      console.log("Retrieved successfully");
      res.status(200).json(newProducts);
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

module.exports = router;
