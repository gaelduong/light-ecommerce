import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config";

const UserProducstDisplay = () => {
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
            {products.map(({ _id, name, price, category, images }) => {
               return (
                  <li key={_id}>
                     <span> {name} </span>
                     <span> {price} VND </span>
                     <span> Category: {category} </span>
                     <div>
                        {images.map((image) => {
                           return <img key={image.order} className="img-display" src={image.imageAsBase64} alt=" product" />;
                        })}
                     </div>
                  </li>
               );
            })}
         </ol>
      </div>
   );
};

export default UserProducstDisplay;
