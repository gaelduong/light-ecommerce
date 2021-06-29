import placeholderImage from "../../assets/placeholder-image.png";
import { ImageInput } from ".";

const generateRandomKey = () => {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
         v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
   });
};

const toBase64 = (file) =>
   new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
   });

const ImageInputList = ({ imagesInput, setImagesInput }) => {
   const handleImageUpload = async (e, id) => {
      const file = e.target.files[0];
      if (!file) return;
      const imgBase64 = await toBase64(file);
      const newImagesInput = [...imagesInput];
      newImagesInput[id] = {
         ...newImagesInput[id],
         path: "",
         imageFile: file,
         imageDisplay: imgBase64
      };
      setImagesInput(newImagesInput);
   };

   const handleImageReset = (id) => {
      console.log("a");
      const newImagesInput = [...imagesInput];
      newImagesInput[id] = {
         ...newImagesInput[id],
         path: "",
         imageFile: null,
         imageDisplay: placeholderImage,
         inputKey: generateRandomKey()
      };
      setImagesInput(newImagesInput);
   };

   return (
      <>
         <label>Image</label>
         {imagesInput.map((imageInput) => (
            <ImageInput key={generateRandomKey()} image={imageInput} handleImageUpload={handleImageUpload} handleImageReset={handleImageReset} />
         ))}
      </>
   );
};

export default ImageInputList;
