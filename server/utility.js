const path = require("path");
const fs = require("fs");

function deleteImage(filePath) {
   fs.unlinkSync(path.resolve(__dirname, `./${filePath}`));
}

function imageExists(filePath) {
   return fs.existsSync(path.resolve(__dirname, `./${filePath}`));
}

function toBase64(filePath) {
   return "data:;base64," + fs.readFileSync(path.resolve(__dirname, `./${filePath}`), "base64");
}

module.exports = {
   deleteImage,
   imageExists,
   toBase64
};
