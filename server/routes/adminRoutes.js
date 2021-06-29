const express = require("express");
const router = express.Router();
const { Product } = require("../models/");
const { toBase64, imageExists, deleteImage } = require("../utility");
const { getProducts } = require("./commonFunctions");

router.get("/products_admin", getProducts);

router.get("/products_admin/:id", async (req, res) => {
   // Retrieve products from DB
   try {
      const product = await Product.findById(req.params.id);
      const productObj = product._doc;
      const images = productObj.images;
      const imagesForClient = [];
      for (const image of images) {
         const imagePath = image.path;
         if (!(imagePath && imageExists(imagePath))) continue;
         const imageAsBase64 = toBase64(imagePath);
         imagesForClient.push({ order: image.order, imageAsBase64: imageAsBase64, path: imagePath });
      }
      productObj.images = imagesForClient;
      console.log("Retrieved successfully");
      res.status(200).json(productObj);
   } catch (error) {
      res.sendStatus(500);
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
      // Remove image file
      const removedProduct = await Product.findById(req.params.id);
      const images = removedProduct.images;
      removedProduct.remove();
      res.status(200).json(removedProduct);
      console.log("Delete from DB successfully");
      if (!(images.length > 0)) return;
      for (const image of images) {
         deleteImage(image.path);
      }
      console.log("Images successfully deleted");
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
         // Delete old images
         for (const imageObj of productToUpdate.images) {
            if (productFields.images.some((image) => image.path === imageObj.path)) continue;
            if (!imageExists(imageObj.path)) continue;
            deleteImage(imageObj.path);
            console.log("Image deleted");
         }
         // Update all fields
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
