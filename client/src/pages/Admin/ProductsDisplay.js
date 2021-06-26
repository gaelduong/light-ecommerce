import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";

const ProductsDisplay = ({ history }) => {
   const loading = useVerifyAuth(history);

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
   }, [products]);

   const handleDeleteProduct = async (e, id) => {
      const { data } = await axios.delete(`${apiUrl}/products_admin/${id}`);
      const newProducts = [...products].filter((product) => product._id !== data._id);
      setProducts(newProducts);
   };

   if (loading) return <></>;
   return (
      <AdminContainer history={history}>
         <br />
         <button onClick={() => history.push("/product-add")}>Add product</button>
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
                     <tr key={_id}>
                        <td>
                           <img className="img-admin" src={imageAsBase64} alt=" display product" />
                        </td>
                        <td> {name} </td>
                        <td> {price} VND </td>
                        <td> {description} </td>
                        <td> {category} </td>
                        <td> {isInStock ? "In Stock" : "Out of stock"} </td>
                        <td>
                           <button
                              onClick={() => {
                                 history.push(`/product-edit/${_id}`, { products });
                              }}
                           >
                              Edit
                           </button>
                        </td>
                        <td>
                           <button onClick={(e) => handleDeleteProduct(e, _id)}> Delete </button>
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
