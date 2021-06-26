import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config";

const AdminAddProduct = ({ history }) => {
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

   // Loading
   const [loading, setLoading] = useState(true);

   // Product fields - Add
   const [productFields, setProductFields] = useState({
      name: "",
      price: 0,
      desc: "",
      category: "",
      isInStock: true
   });
   const [imageFile, setImageFile] = useState(null);

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
      formData.append("image", imageFile);
      try {
         const { data } = await axios.post(`${apiUrl}/imageupload`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         // Send POST request to add new product to DB
         await axios.post(`${apiUrl}/products_admin`, {
            name: productFields.name,
            price: productFields.price,
            description: productFields.desc,
            category: productFields.category,
            isInStock: productFields.isInStock,
            image: data
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
      <>
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
               Image:
               <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>

            <br />

            <input type="submit" value="Add product" />
         </form>
         <button id="cancel-btn" onClick={() => history.push("/admin")}>
            Discard
         </button>
      </>
   );
};

export default AdminAddProduct;
