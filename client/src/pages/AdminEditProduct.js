import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config";

const AdminEditProduct = ({ history, location }) => {
   useEffect(() => {
      const redirectToLogin = () => history.push("/login");
      const getCookieValue = (name) => document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
      const accessToken = getCookieValue("accessToken");
      if (!accessToken) redirectToLogin();

      const verifyLoggedIn = async (accessToken) => {
         try {
            await axios.get(`${apiUrl}/isloggedin`, {
               headers: {
                  Authorization: `Bearer ${accessToken}`
               }
            });
            setLoading(false);
         } catch (error) {
            console.log(error);
            redirectToLogin();
         }
      };
      verifyLoggedIn(accessToken);
   }, [history]);

   // Get product infos from url
   const { productId } = useParams();
   const products = location.state && location.state.products;

   // Loading
   const [loading, setLoading] = useState(true);

   // Product edit fields
   const [productNameEdit, setProductNameEdit] = useState("");
   const [productPriceEdit, setProductPriceEdit] = useState(0);
   const [productDescriptionEdit, setProductDescriptionEdit] = useState("");
   const [productCategoryEdit, setProductCategoryEdit] = useState("");
   const [productIsInStockEdit, setProductIsInStockEdit] = useState(true);
   const [productImageFileEdit, setProductImageFileEdit] = useState("");

   useEffect(() => {
      if (!productId) return;

      const product = products.find((product) => product._id === productId);
      setProductNameEdit(product.name);
      setProductPriceEdit(product.price);
      setProductDescriptionEdit(product.description);
      setProductCategoryEdit(product.category);
      setProductIsInStockEdit(product.isInStock);
   }, [products, productId]);

   const handleEditProduct = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("image", productImageFileEdit);
      try {
         const { data } = await axios.post(`${apiUrl}/imageupload/${productId}`, formData, {
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
         await axios.put(`${apiUrl}/products_admin/${productId}`, editedProduct);
         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         console.log(error);
      }
   };
   if (loading) return <></>;

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
