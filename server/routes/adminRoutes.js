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
               imagesForClient.push({ order: image.order, imageAsBase64: "data:;base64," + imageAsBase64, path: imagePath });
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

router.get("/products_admin/:id", async (req, res) => {
   // Retrieve products from DB
   try {
      const product = await Product.findById(req.params.id);
      const productObj = product._doc;
      const images = productObj.images;
      const imagesForClient = [];
      for (const image of images) {
         const imagePath = image.path;
         const doesImageExist = fs.existsSync(path.resolve(__dirname, `../${imagePath}`));

         if (!imagePath || !doesImageExist) continue;

         const imageAsBase64 = fs.readFileSync(path.resolve(__dirname, `../${imagePath}`), "base64");
         imagesForClient.push({ order: image.order, imageAsBase64: "data:;base64," + imageAsBase64, path: imagePath });
      }
      productObj.images = imagesForClient;
      console.log("Retrieved successfully");
      res.status(200).json(productObj);
   } catch (error) {
      // console.log(error);
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
      const removedProduct = await Product.findById(req.params.id);
      // Remove image file
      const images = removedProduct.images;
      removedProduct.remove();
      res.status(200).json(removedProduct);
      console.log("Delete from DB successfully");
      if (images.length > 0) {
         for (const image of images) {
            fs.unlinkSync(path.resolve(__dirname, `../${image.path}`));
         }
         console.log("Images successfully deleted");
      }
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
            if (!productFields.images.some((image) => image.path === imageObj.path)) {
               if (!fs.existsSync(path.resolve(__dirname, `../${imageObj.path}`))) {
                  continue;
               }
               fs.unlinkSync(path.resolve(__dirname, `../${imageObj.path}`));
               console.log("Image deleted");
            }
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
