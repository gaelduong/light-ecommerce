const express = require("express");
const router = express.Router();
const { Product } = require("../models/");

router.get("/products_admin", async (req, res) => {
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

router.post("/products_admin", async (req, res) => {
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

router.delete("/products_admin/:id", async (req, res) => {
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

router.put("/products_admin/:id", async (req, res) => {
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

module.exports = router;
