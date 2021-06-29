const { Product } = require("../models");
const { toBase64, imageExists } = require("../utility");

async function getProducts(req, res) {
   // Retrieve products from DB
   try {
      const products = await Product.find({});
      const newProducts = products.map((product) => {
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
         return productObj;
      });
      console.log("Retrieved successfully");
      res.status(200).json(newProducts);
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
}

module.exports = {
   getProducts
};