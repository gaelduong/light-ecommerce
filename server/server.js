const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./dbConfig");
const { Product, User } = require("./models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());

dbConnect();

// Public routes
app.get("/products", async (req, res) => {
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

// Private routes
app.get("/products_admin", async (req, res) => {
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

app.post("/products_admin", async (req, res) => {
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

//test upload image

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
   destination(req, file, cb) {
      cb(null, "uploads/");
   },
   filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
   }
});

function checkFileType(file, cb) {
   const filetypes = /jpg|jpeg|png/;
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   const mimetype = filetypes.test(file.mimetype);

   if (extname && mimetype) {
      return cb(null, true);
   } else {
      cb("Images only!");
   }
}

const upload = multer({
   storage,
   fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
   }
});

app.post("/imageupload", upload.single("image"), (req, res) => {
   res.send(`/${req.file.path}`);
   // console.log(req.body);
});

app.delete("/products_admin/:id", async (req, res) => {
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

app.put("/products_admin/:id", async (req, res) => {
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

// Authentication

app.post("/login", async (req, res) => {
   console.log(req.body);
   const user = await User.findOne({ name: req.body.name });
   if (!user) {
      return res.sendStatus(403);
   }
   const hashedPassword = user.password;
   const passwordMatched = await bcrypt.compare(req.body.password, hashedPassword);
   if (!passwordMatched) {
      return res.sendStatus(403);
   }
   const accessToken = jwt.sign({ name: user.name }, process.env.JWT_ACCESS_TOKEN);
   return res.json({ name: user.name, accessToken: accessToken });
});

app.get("/isloggedin", (req, res) => {
   const accessToken = req.headers["authorization"].split(" ")[1];
   try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
      res.json(decoded);
   } catch (e) {
      return res.sendStatus(403);
   }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
