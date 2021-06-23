import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config";

const AdminEditProduct = ({ history, location }) => {
   const productEditId = location.search.split("=")[1];
   const products = location.state.products;

   const [productNameEdit, setProductNameEdit] = useState("");
   const [productPriceEdit, setProductPriceEdit] = useState(0);
   const [productDescriptionEdit, setProductDescriptionEdit] = useState("");
   const [productCategoryEdit, setProductCategoryEdit] = useState("");
   const [productIsInStockEdit, setProductIsInStockEdit] = useState(true);
   const [productImageFileEdit, setProductImageFileEdit] = useState("");

   useEffect(() => {
      if (!productEditId) return;

      const product = products.find((product) => product._id === productEditId);
      setProductNameEdit(product.name);
      setProductPriceEdit(product.price);
      setProductDescriptionEdit(product.description);
      setProductCategoryEdit(product.category);
      setProductIsInStockEdit(product.isInStock);
   }, [products, productEditId]);

   const handleEditProduct = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", productImageFileEdit);
      try {
         const { data } = await axios.post(`${apiUrl}/imageupload/${productEditId}`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         const editedProduct = {
            name: productNameEdit,
            price: productPriceEdit,
            description: productDescriptionEdit,
            category: productCategoryEdit,
            isInStock: productIsInStockEdit,
            image: data
         };
         await axios.put(`${apiUrl}/products_admin/${productEditId}`, editedProduct);
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <>
         <h1> EDIT </h1>
         <form onSubmit={(e) => handleEditProduct(e)}>
            <label>
               New name:
               <input type="text" value={productNameEdit} onChange={(e) => setProductNameEdit(e.target.value)} />
            </label>
            <label>
               New price:
               <input type="number" value={productPriceEdit} onChange={(e) => setProductPriceEdit(e.target.value)} />
            </label>
            <label>
               New description:
               <textarea value={productDescriptionEdit} onChange={(e) => setProductDescriptionEdit(e.target.value)} />
            </label>

            <label>
               New category:
               <select required value={productCategoryEdit} onChange={(e) => setProductCategoryEdit(e.target.value)}>
                  <option value="A"> A</option>
                  <option value="B"> B</option>
                  <option value="C"> C</option>
                  <option value="D"> D</option>
               </select>
            </label>
            <label>
               Is in stock:
               <input type="checkbox" checked={productIsInStockEdit} onChange={(e) => setProductIsInStockEdit(!productIsInStockEdit)} />
            </label>
            <label>
               New image:
               <input type="file" name="image" onChange={(e) => setProductImageFileEdit(e.target.files[0])} />
            </label>

            <input type="submit" value="Update" />
            <button
               id="cancel-btn"
               onClick={() => {
                  history.push("/admin");
               }}
            >
               Discard
            </button>
         </form>
      </>
   );
};

export default AdminEditProduct;
