import { useState } from "react";
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

const ProductAdd = ({ history }) => {
   const loading = useVerifyAuth(history);

   const [productFields, setProductFields] = useState({
      name: "",
      price: 0,
      desc: "",
      category: "",
      isInStock: true
   });

   const [images, setImages] = useState([
      { order: 0, imageFile: null, inputKey: generateRandomKey(), imageDisplay: placeholderImage },
      { order: 1, imageFile: null, inputKey: generateRandomKey(), imageDisplay: placeholderImage }
   ]);

   const handleImageUpload = async (e, id) => {
      const file = e.target.files[0];
      if (!file) return;
      const imgBase64 = await toBase64(file);
      const newImages = [...images];
      newImages[id] = {
         ...newImages[id],
         imageFile: file,
         imageDisplay: imgBase64
      };
      setImages(newImages);
   };

   const handleImageReset = (id) => {
      const newImages = [...images];
      newImages[id] = {
         ...newImages[id],
         imageFile: null,
         imageDisplay: placeholderImage,
         inputKey: generateRandomKey()
      };
      setImages(newImages);
   };

   const handleChange = (e) => {
      let value = e.target.value;
      let type = e.target.type;
      let name = e.target.name;

      if (type === "checkbox") {
         value = !productFields.isInStock;
      } else if (type === "number") {
         value = parseFloat(value);
      }
      const newProductFields = {
         ...productFields,
         [name]: value
      };

      setProductFields(newProductFields);
   };

   const handleAddProduct = async (e) => {
      e.preventDefault();

      // Upload image to server
      const formData = new FormData();
      formData.append("image", images[0].imageFile);
      formData.append("image", images[1].imageFile);
      try {
         const { data } = await axios.post(`${apiUrl}/imageupload`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         console.log("🚀 ~ file: ProductAdd.js ~ line 94 ~ handleAddProduct ~ data", data);
         // Send POST request to add new product to DB
         await axios.post(`${apiUrl}/products_admin`, {
            name: productFields.name,
            price: productFields.price,
            description: productFields.desc,
            category: productFields.category,
            isInStock: productFields.isInStock,
            images: data
            //image: [{id:0, path:...}, {id:1, path:...},...]
         });
         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         return console.log(error);
      }
   };

   if (loading) return <></>;

   const { name, price, desc, category, isInStock } = productFields;
   return (
      <AdminContainer history={history}>
         <h1> ADD PRODUCT </h1>
         <form onSubmit={handleAddProduct}>
            <label>
               Name:
               <input required type="text" name="name" value={name} onChange={handleChange} />
            </label>
            <label>
               Price:
               <input required type="number" name="price" step={0.01} min={0} value={price} onChange={handleChange} />
            </label>
            <label>
               Description:
               <textarea name="desc" value={desc} onChange={handleChange} />
            </label>
            <label>
               Category:
               <select required name="category" value={category} onChange={handleChange}>
                  <option value="">Choose category</option>
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
            <label>
               Image
               <img className="image-label" src={images[0].imageDisplay} alt="" />
               <input type="file" accept="image/*" key={images[0].inputKey} onChange={(e) => handleImageUpload(e, 0)} />
               <button type="button" onClick={(e) => handleImageReset(0)}>
                  x
               </button>
            </label>
            <label>
               <img className="image-label" src={images[1].imageDisplay} alt="" />
               <input type="file" accept="image/*" key={images[1].inputKey} onChange={(e) => handleImageUpload(e, 1)} />
               <button type="button" onClick={(e) => handleImageReset(1)}>
                  x
               </button>
            </label>
            <br />
            <input type="submit" value="Add product" />
         </form>
         <button id="cancel-btn" onClick={() => history.push("/admin")}>
            Discard
         </button>
      </AdminContainer>
   );
};

export default ProductAdd;
