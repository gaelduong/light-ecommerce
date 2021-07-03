export function getFormattedImagePaths(imagesInput, fetchedImagePaths) {
   const formattedImagePaths = [];
   let order = 0;
   for (const imageInput of imagesInput) {
      if (imageInput.path) {
         formattedImagePaths.push({ order: order++, path: imageInput.path });
         continue;
      }
      if (imageInput.imageFile) {
         formattedImagePaths.push({ order: order++, path: fetchedImagePaths[0] });
         fetchedImagePaths.shift();
      }
   }
   return formattedImagePaths;
}
