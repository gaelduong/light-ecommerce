import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config";
import AdminEditProduct from "./AdminEditProduct.js";

const AdminMain = ({ history }) => {
   // Loading
   const [loading, setLoading] = useState(true);

   // Display products
   const [products, setProducts] = useState([]);

   // Products changed
   const [productsChanged, setProductsChanged] = useState(true);

   // Product edit
   const [productEditId, setProductEditId] = useState("");

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

   const logoutHandler = () => {
      const delete_cookie = (name) => {
         document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      };
      delete_cookie("accessToken");
      history.push("/login");
   };

   useEffect(() => {
      if (!productsChanged) return;

      const fetchProducts = async () => {
         // console.log(process.env.NODE_ENV);
         const { data } = await axios.get(`${apiUrl}/products_admin`);
         setProducts(data);
         setProductsChanged(false);
      };
      fetchProducts();
   }, [productsChanged]);

   const handleDeleteProduct = async (e, id) => {
      const { data } = await axios.delete(`${apiUrl}/products_admin/${id}`);
      const newProducts = [...products].filter((product) => product._id !== data._id);
      setProducts(newProducts);
   };

   const handleEnableProductEdit = (e, id) => {
      setProductEditId(id);
   };

   if (loading) return <></>;

   return (
      <div className="Admin">
         <button onClick={logoutHandler}> Log out </button>
         <br />
         <button onClick={() => history.push("/admin-add-product")}>Add product</button>

         {productEditId && (
            <AdminEditProduct products={products} productEditId={productEditId} setProductEditId={setProductEditId} setProductsChanged={setProductsChanged} />
         )}

         <h2>My products: </h2>
         <table>
            <tbody>
               <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Edit</th>
                  <th>Delete</th>
               </tr>
               {products.map(({ _id, name, price, description, category, isInStock, imageAsBase64 }) => {
                  return (
                     <tr style={{ color: productEditId === _id ? "red" : "white" }} key={_id}>
                        <td>
                           <img className="img-admin" src={imageAsBase64} alt=" display product" />
                        </td>
                        <td> {name} </td>
                        <td> {price} VND </td>
                        <td> {description} </td>
                        <td> {category} </td>
                        <td> {isInStock ? "In Stock" : "Out of stock"} </td>
                        <td>
                           <button onClick={(e) => handleEnableProductEdit(e, _id)}>Edit</button>
                        </td>
                        <td>
                           <button onClick={(e) => handleDeleteProduct(e, _id)}> Delete </button>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
};

export default AdminMain;
