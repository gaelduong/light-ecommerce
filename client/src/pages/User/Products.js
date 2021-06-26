import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const Products = () => {
   const [products, setProducts] = useState([]);

   useEffect(() => {
      const fetchProducts = async () => {
         const { data } = await axios.get(`${apiUrl}/products`);
         setProducts(data);
      };
      fetchProducts();
   }, []);

   return (
      <div className="Products">
         <h2>My products: </h2>
         <ol>
            {products.map(({ _id, name, price, category, imageAsBase64 }) => {
               return (
                  <li key={_id}>
                     <span> {name} </span>
                     <span> {price} VND </span>
                     <span> Category: {category} </span>

                     <img src={imageAsBase64} alt="display product" />
                  </li>
               );
            })}
         </ol>
      </div>
   );
};

export default Products;
