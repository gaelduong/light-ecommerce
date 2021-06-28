import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image-2.png";

const ProductsDisplay = ({ history }) => {
   const authVerified = useVerifyAuth(history);

   const [products, setProducts] = useState([]);

   useEffect(() => {
      let mounted = true;
      const fetchProducts = async () => {
         try {
            const { data } = await axios.get(`${apiUrl}/products_admin`);
            if (!mounted) return;
            setProducts(data);
         } catch (error) {
            return console.log(error);
         }
      };
      fetchProducts();
      return () => (mounted = false);
   }, []);

   const handleDeleteProduct = async (id) => {
      const { data } = await axios.delete(`${apiUrl}/products_admin/${id}`);
      const newProducts = [...products].filter((product) => product._id !== data._id);
      setProducts(newProducts);
   };

   if (!authVerified) return <></>;
   console.log(products);
   return (
      <AdminContainer history={history}>
         <br />
         <button onClick={() => history.push("/product-add")}>Add product</button>
         <h2>My products: </h2>
         <table>
            <tbody>
               <tr>
                  <th>Cover Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Actions</th>
               </tr>
               {products.map(({ _id, name, price, description, category, isInStock, images }) => {
                  return (
                     <tr key={_id}>
                        <td>
                           <Link to={`/product-edit/${_id}`}>
                              <img className="img-display" src={images.length > 0 ? images[0].imageAsBase64 : placeholderImage} alt=" product" />
                           </Link>
                        </td>
                        <td> {name} </td>
                        <td> {price} VND </td>
                        <td> {description} </td>
                        <td> {category} </td>
                        <td> {isInStock ? "In Stock" : "Out of stock"} </td>
                        <td>
                           <button
                              className="action-btn bg-color-green "
                              onClick={() => {
                                 history.push(`/product-edit/${_id}`);
                              }}
                           >
                              Edit
                           </button>
                           <button className="action-btn bg-color-red" onClick={() => handleDeleteProduct(_id)}>
                              Delete
                           </button>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </AdminContainer>
   );
};

export default ProductsDisplay;
