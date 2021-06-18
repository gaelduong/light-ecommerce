import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config";
import EditProduct from "./EditProduct.js";
import AddProduct from "./AddProduct.js";

const Admin = ({ history }) => {
   // Loading
   const [loading, setLoading] = useState(true);

   // Display products
   const [products, setProducts] = useState([]);

   // Products changed
   const [productsChanged, setProductsChanged] = useState(true);

   // Add product toggle
   const [addProductToggled, toggleAddProduct] = useState(false);

   // Product edit
   const [productEditId, setProductEditId] = useState("");

   useEffect(() => {
      const redirectToLogin = () => history.push("/login");
      const getCookieValue = (name) => document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
      const accessToken = getCookieValue("accessToken");
      if (!accessToken) redirectToLogin();

      const verifyLoggedIn = async (accessToken) => {
         try {
            await axios.get(`${serverUrl}/isloggedin`, {
               headers: {
                  Authorization: `Bearer ${accessToken}`
               }
            });
            setLoading(false);
         } catch (e) {
            console.log(e);
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
         const { data } = await axios.get(`${serverUrl}/products_admin`);
         setProducts(data);
         setProductsChanged(false);
      };
      fetchProducts();
   }, [productsChanged]);

   const handleDeleteProduct = async (e, id) => {
      const { data } = await axios.delete(`${serverUrl}/products_admin/${id}`);
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
         <button onClick={() => toggleAddProduct(!addProductToggled)}> {addProductToggled ? "Cancel" : "Add product"} </button>

         {addProductToggled && <AddProduct setProductsChanged={setProductsChanged} />}

         {productEditId && <EditProduct products={products} productEditId={productEditId} setProductEditId={setProductEditId} setProductsChanged={setProductsChanged} />}

         <h2>My products: </h2>
         <table>
            <tbody>
               <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Edit</th>
                  <th>Delete</th>
               </tr>
               {products.map(({ _id, name, price, description, category, isInStock }) => {
                  return (
                     <tr style={{ color: productEditId === _id ? "red" : "white" }} key={_id}>
                        <td> {name} </td>
                        <td> ${price} </td>
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

export default Admin;
