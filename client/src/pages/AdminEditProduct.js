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
   const [productFields, setProductFields] = useState({
      name: "",
      price: 0,
      desc: "",
      category: "",
      isInStock: true,
      imageAsBase64: ""
   });
   const [productImageFileEdit, setProductImageFileEdit] = useState("");

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

   useEffect(() => {
      if (!productId) return;

      const product = products.find((product) => product._id === productId);
      setProductFields({
         name: product.name,
         price: product.price,
         desc: product.description,
         category: product.category,
         isInStock: product.isInStock,
         imageAsBase64: product.imageAsBase64
      });
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
            name: productFields.name,
            price: productFields.price,
            description: productFields.desc,
            category: productFields.category,
            isInStock: productFields.isInStock,
            image: data
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
   if (loading) return <></>;

   const { name, price, desc, category, isInStock, imageAsBase64 } = productFields;
   return (
      <>
         <h1> EDIT </h1>
         <form onSubmit={(e) => handleEditProduct(e)}>
            <label>
               New name:
               <input type="text" name="name" value={name} onChange={handleChange} />
            </label>
            <label>
               New price:
               <input type="number" name="price" value={price} onChange={handleChange} />
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
            <label>
               New image:
               <input type="file" name="image" onChange={(e) => setProductImageFileEdit(e.target.files[0])} />
            </label>
            <img src={imageAsBase64} alt="" />

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
