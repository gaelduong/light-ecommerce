import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../config";

const AddProduct = ({ setProductsChanged }) => {
   // Product fields - Add
   const [productNameInput, setProductNameInput] = useState("");
   const [productPriceInput, setProductPriceInput] = useState(0);
   const [productDescriptionInput, setProductDescriptionInput] = useState("");
   const [productCategoryInput, setProductCategoryInput] = useState("");
   const [productIsInStockInput, setProductIsInStockInput] = useState(true);
   const [imageFile, setImageFile] = useState(null);
   const [inputFileKey, setInputFileKey] = useState("");

   const handleAddProduct = async (e) => {
      e.preventDefault();

      // Upload image to server
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
         const { data } = await axios.post(`${serverUrl}/imageupload`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         // Send POST request to add new product to DB
         await axios.post(`${serverUrl}/products_admin`, {
            name: productNameInput,
            price: productPriceInput,
            description: productDescriptionInput,
            category: productCategoryInput,
            isInStock: productIsInStockInput,
            image: data
         });
         setProductsChanged(true);
         setProductNameInput("");
         setProductPriceInput(0);
         setProductDescriptionInput("");
         setProductCategoryInput("");
         setImageFile("");
         setInputFileKey(Date.now());
         return console.log(e);
      } catch (e) {
         return console.log(e);
      }
   };

   return (
      <>
         <h1> ADD PRODUCT </h1>
         <form onSubmit={handleAddProduct}>
            <label>
               Name:
               <input
                  required
                  type="text"
                  value={productNameInput}
                  onChange={(e) => {
                     setProductNameInput(e.target.value);
                  }}
               />
            </label>
            <label>
               Price:
               <input
                  required
                  type="number"
                  step={0.01}
                  min={0}
                  value={productPriceInput}
                  onChange={(e) => {
                     setProductPriceInput(Number(e.target.value).toString());
                  }}
               />
            </label>

            <label>
               Description:
               <textarea
                  value={productDescriptionInput}
                  onChange={(e) => {
                     setProductDescriptionInput(e.target.value);
                  }}
               />
            </label>

            <label>
               Category:
               <select required value={productCategoryInput} onChange={(e) => setProductCategoryInput(e.target.value)}>
                  <option value="">Choose category</option>
                  <option value="A"> A</option>
                  <option value="B"> B</option>
                  <option value="C"> C</option>
                  <option value="D"> D</option>
               </select>
            </label>

            <label>
               Is in stock:
               <input
                  type="checkbox"
                  checked={productIsInStockInput}
                  onChange={(e) => {
                     setProductIsInStockInput(!productIsInStockInput);
                  }}
               />
            </label>
            <label>
               Image:
               <input type="file" name="image" key={inputFileKey} onChange={(e) => setImageFile(e.target.files[0])} />
            </label>

            <br />

            <input type="submit" value="Add product" />
         </form>
      </>
   );
};

export default AddProduct;
