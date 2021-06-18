import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config";

const EditProduct = ({ products, productEditId, setProductEditId, setProductsChanged }) => {
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
      //   setProductImageFileEdit(product.name);
   }, [products, productEditId]);

   const handleEditProduct = async (e) => {
      e.preventDefault();
      const editedProduct = {
         name: productNameEdit,
         price: productPriceEdit,
         description: productDescriptionEdit,
         category: productCategoryEdit,
         isInStock: productIsInStockEdit,
         image: ""
      };
      await axios.put(`${serverUrl}/products_admin/${productEditId}`, editedProduct);
      setProductsChanged(true);
      setProductEditId("");
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
                  <option value="categoryA">Category A</option>
                  <option value="categoryB">Category B</option>
                  <option value="categoryC">Category C</option>
                  <option value="categoryD">Category D</option>
               </select>
            </label>
            <label>
               New stock availability:
               <input type="checkbox" checked={productIsInStockEdit} onChange={(e) => setProductIsInStockEdit(!productIsInStockEdit)} />
            </label>
            <label>
               New image:
               <input type="file" name="image" />
            </label>

            <input type="submit" value="Update" />
            <button
               id="cancel-btn"
               onClick={() => {
                  setProductEditId("");
               }}
            >
               Cancel
            </button>
         </form>
      </>
   );
};

export default EditProduct;
