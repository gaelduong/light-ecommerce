import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config";
import Edit from "./Edit.js";

const Admin = ({ history }) => {
   // Loading
   const [loading, setLoading] = useState(true);

   // Display products
   const [products, setProducts] = useState([]);

   // Products changed
   const [productsChanged, setProductsChanged] = useState(true);

   // Product fields - Add
   const [productNameInput, setProductNameInput] = useState("");
   const [productPriceInput, setProductPriceInput] = useState(0);
   const [productDescriptionInput, setProductDescriptionInput] = useState("");
   const [productCategoryInput, setProductCategoryInput] = useState("");
   const [productIsInStockInput, setProductIsInStockInput] = useState(true);
   const [imagePathInput, setImagePathInput] = useState(null);
   const [imageFile, setImageFile] = useState(null);
   const [inputFileKey, setInputFileKey] = useState("");

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

   const handleAddProduct = async (e) => {
      e.preventDefault();

      if (imageFile) {
         // Upload image to server
         const formData = new FormData();
         formData.append("image", imageFile);
         try {
            const { data } = await axios.post(`${serverUrl}/imageupload`, formData, {
               headers: {
                  "Content-Type": "multipart/form-data"
               }
            });
            setImagePathInput(data);
         } catch (e) {
            return console.log(e);
         }
      }

      // Send POST request to add new product to DB
      try {
         await axios.post(`${serverUrl}/products_admin`, {
            name: productNameInput,
            price: productPriceInput,
            description: productDescriptionInput,
            category: productCategoryInput,
            isInStock: productIsInStockInput,
            image: imagePathInput
         });
         setProductsChanged(true);
         setProductNameInput("");
         setProductPriceInput(0);
         setProductDescriptionInput("");
         setProductCategoryInput("");
         setImageFile("");
         setInputFileKey(Date.now());
      } catch (e) {
         return console.log(e);
      }
   };

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
         <h1> ADD PRODUCT </h1>
         <button onClick={logoutHandler}> Log out </button>
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
                  <option value="categoryA">Category A</option>
                  <option value="categoryB">Category B</option>
                  <option value="categoryC">Category C</option>
                  <option value="categoryD">Category D</option>
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

         {productEditId && <Edit products={products} productEditId={productEditId} setProductEditId={setProductEditId} setProductsChanged={setProductsChanged} />}

         <h2>My products: </h2>
         <ol>
            {products.map(({ _id, name }) => {
               return (
                  <li style={{ color: productEditId === _id ? "red" : "white" }} key={_id}>
                     <span> {name} </span>
                     <button onClick={(e) => handleEnableProductEdit(e, _id)}>Edit</button>
                     <button onClick={(e) => handleDeleteProduct(e, _id)}> Delete </button>
                  </li>
               );
            })}
         </ol>
      </div>
   );
};

export default Admin;
