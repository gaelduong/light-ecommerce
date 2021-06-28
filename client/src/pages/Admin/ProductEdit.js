import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image.png";

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

const ProductEdit = ({ history }) => {
   const authVerified = useVerifyAuth(history);

   // Get product id from url
   const { productId } = useParams();

   const [productFields, setProductFields] = useState(null);
   const [imagesInput, setImagesInput] = useState(
      [...Array(6)].map((_, idx) => ({ order: idx, imageFile: null, inputKey: generateRandomKey(), imageDisplay: placeholderImage }))
   );

   useEffect(() => {
      if (!productId) return;

      const fetchProduct = async () => {
         try {
            const { data } = await axios.get(`${apiUrl}/products_admin/${productId}`);
            setProductFields({
               name: data.name,
               price: data.price,
               desc: data.description,
               category: data.category,
               isInStock: data.isInStock
            });
            const productImages = data.images;
            const newImagesInput = imagesInput.map((imageInput, idx) => ({
               order: imageInput.order,
               path: (productImages[idx] && productImages[idx].path) || "",
               imageFile: null,
               inputKey: imageInput.inputKey,
               imageDisplay: (productImages[idx] && productImages[idx].imageAsBase64) || placeholderImage
            }));
            console.log("🚀 ~ file: ProductEdit.js ~ line 105 ~ newImagesInput ~ newImagesInput", newImagesInput);

            setImagesInput(newImagesInput);
         } catch (error) {
            console.log("Error loading product");
         }
      };
      fetchProduct();
   }, [productId]);

   const handleImageUpload = async (e, id) => {
      const file = e.target.files[0];
      console.log("🚀 ~ file: ProductEdit.js ~ line 46 ~ handleImageUpload ~ file", file);
      if (!file) return;
      const imgBase64 = await toBase64(file);
      const newImagesInput = [...imagesInput];
      newImagesInput[id] = {
         ...newImagesInput[id],
         path: "",
         imageFile: file,
         imageDisplay: imgBase64
      };
      console.log("🚀 ~ file: ProductEdit.js ~ line 51 ~ handleImageUpload ~ newImagesInput", newImagesInput);
      setImagesInput(newImagesInput);
   };

   const handleImageReset = (id) => {
      const newImagesInput = [...imagesInput];
      newImagesInput[id] = {
         ...newImagesInput[id],
         path: "",
         imageFile: null,
         imageDisplay: placeholderImage,
         inputKey: generateRandomKey()
      };
      console.log("🚀 ~ file: ProductEdit.js ~ line 61 ~ handleImageReset ~ newImagesInput", newImagesInput);
      setImagesInput(newImagesInput);
   };

   const handleChange = (e) => {
      let value = e.target.value;
      let type = e.target.type;
      let name = e.target.name;

      if (type === "checkbox") {
         value = !productFields.isInStock;
      } else if (type === "number") {
         value = ''+parseFloat(value);
      }
      const newProductFields = {
         ...productFields,
         [name]: value
      };

      setProductFields(newProductFields);
   };

   const handleEditProduct = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      for (const imageInput of imagesInput) {
         if (!imageInput.imageFile) continue;
         formData.append("image", imageInput.imageFile);
      }

      try {
         const { data } = await axios.post(`${apiUrl}/imageupload/${productId}`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         console.log("🚀 ~ file: ProductEdit.js ~ line 128 ~ handleEditProduct ~ data", data);

         const imagePaths = [];
         let order = 0;
         for (const imageInput of imagesInput) {
            if (imageInput.path) {
               imagePaths.push({ order: order++, path: imageInput.path });
               continue;
            }
            if (imageInput.imageFile) {
               imagePaths.push({ order: order++, path: data[0] });
               data.shift();
            }
         }

         console.log("🚀 ~ file: ProductEdit.js ~ line 131 ~ handleEditProduct ~ imagePaths", imagePaths);

         const editedProduct = {
            name: productFields.name,
            price: productFields.price,
            description: productFields.desc,
            category: productFields.category,
            isInStock: productFields.isInStock,
            images: imagePaths
         };
         await axios.put(`${apiUrl}/products_admin/${productId}`, editedProduct);

         // Redirect to admin main page once edit is done
         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         console.log(error);
      }
   };
   if (!authVerified || !productFields) return <></>;

   const { name, price, desc, category, isInStock } = productFields;
   return (
      <AdminContainer history={history}>
         <h1> EDIT </h1>
         <form onSubmit={(e) => handleEditProduct(e)}>
            <label>
               New name:
               <input type="text" name="name" value={name} onChange={handleChange} />
            </label>
            <label>
               New price:
               <input type="number" name="price" step={0.1} min={0} value={price} onChange={handleChange} />
            </label>
            <label>
               New description:
               <textarea name="desc" value={desc} onChange={handleChange} />
            </label>
            <label>
               New category:
               <select required name="category" value={category} onChange={handleChange}>
                  <option value="A"> A</option>
                  <option value="B"> B</option>
                  <option value="C"> C</option>
                  <option value="D"> D</option>
               </select>
            </label>
            <label>
               Is in stock:
               <input type="checkbox" name="isInStock" checked={isInStock} onChange={handleChange} />
            </label>
            <label>Image</label>
            {imagesInput.map((image) => (
               <label className="img-label-container" key={image.order}>
                  <img className="img-label" src={image.imageDisplay} alt="" />
                  <input type="file" accept="image/*" key={image.inputKey} onChange={(e) => handleImageUpload(e, image.order)} />
                  <button className="img-reset-btn" type="button" onClick={() => handleImageReset(image.order)}>
                     x
                  </button>
                  {(image.imageDisplay !== placeholderImage && <pre className="image-edit-txt"> Edit </pre>) || <pre className="image-edit-txt"> Add </pre>}
               </label>
            ))}
            <input className="bg-color-green" type="submit" value="Update" />
            <button
               className="bg-color-red"
               onClick={() => {
                  history.push("/admin");
               }}
            >
               Discard
            </button>
         </form>
      </AdminContainer>
   );
};

export default ProductEdit;
