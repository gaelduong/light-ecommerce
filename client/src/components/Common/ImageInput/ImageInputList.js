import placeholderImage from "../../../assets/placeholder-image.png";
import ImageInput from "./ImageInput.js";
import { generateUniqueId } from "../commonUtility.js";

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
      const newImagesInput = [...imagesInput];
      newImagesInput[id] = {
         ...newImagesInput[id],
         path: "",
         imageFile: null,
         imageDisplay: placeholderImage,
         inputKey: generateUniqueId()
      };
      setImagesInput(newImagesInput);
   };

   return (
      <>
         <label>Images</label>
         {imagesInput.map((imageInput) => (
            <ImageInput key={generateUniqueId()} image={imageInput} handleImageUpload={handleImageUpload} handleImageReset={handleImageReset} />
         ))}
      </>
   );
};

export default ImageInputList;
