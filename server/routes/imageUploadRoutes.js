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
      cb(null, `${file.fieldname}-${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
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

router.post("/imageupload", upload.array("image"), (req, res) => {
   try {
      const imagePaths = req.files.map((file) => file.path);
      res.status(200).send(imagePaths);
   } catch (error) {
      res.status(200).send([]);
   }
});

module.exports = router;
