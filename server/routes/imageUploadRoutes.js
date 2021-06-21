const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");

const { Product } = require("../models/");

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

router.post("/imageupload", upload.single("image"), (req, res) => {
   try {
      res.send(`/${req.file.path}`);
   } catch (error) {
      res.send("");
   }
});

router.post("/imageupload/:id", upload.single("image"), async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.sendStatus(500);
      // Delete previous image if it exists
      if (product.image) {
         fs.unlinkSync(path.resolve(__dirname, `../${product.image}`));
         console.log("Image deleted");
      }
      res.send(`/${req.file.path}`);
   } catch (error) {
      res.send("");
   }
});

module.exports = router;
