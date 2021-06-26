const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { Product } = require("../models/");

router.get("/products_admin", async (req, res) => {
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
      res.sendtatus(500);
   }
});

router.post("/products_admin", async (req, res) => {
   // Insert product to DB
   const product = req.body;
   const newProduct = new Product(product);
   try {
      const addedProduct = await newProduct.save();
      console.log("Saved to DB successfully");
      res.status(201).json(addedProduct);
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

router.delete("/products_admin/:id", async (req, res) => {
   try {
      const removedProduct = await Product.findById(req.params.id);
      // Remove image file
      const imageFilePath = removedProduct.image;
      removedProduct.remove();
      res.status(200).json(removedProduct);
      if (imageFilePath) {
         fs.unlinkSync(path.resolve(__dirname, `../${imageFilePath}`));
         console.log("Image deleted");
      }
      console.log("Delete from DB successfully");
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

router.put("/products_admin/:id", async (req, res) => {
   // Update product in DB
   try {
      const productFields = req.body;
      const productToUpdate = await Product.findById(req.params.id);
      if (productToUpdate) {
         Object.entries(productFields).forEach(([key, value]) => {
            productToUpdate[key] = value;
         });
      }
      await productToUpdate.save();
      res.status(200).json(productToUpdate);
      console.log("Updated product in DB successfully");
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

module.exports = router;
