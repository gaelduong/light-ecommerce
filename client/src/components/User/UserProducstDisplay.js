import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import placeholderImage from "../../assets/placeholder-image-2.png";

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
         <h2>Our products: </h2>
         <ol>
            {products.map(({ _id, name, price, category, isInStock, images }) => {
               return (
                  <li key={_id}>
                     <span> {name} </span>
                     <span> {price} VND </span>
                     <span> Category: {category} </span>
                     <span> {isInStock ? "" : "(Out of stock)"} </span>
                     <div>
                        <Link to={`/product-details/${_id}`}>
                           {images.length > 0 ? (
                              <img key={images[0].order} className="img-display" src={images[0].imageAsBase64} alt=" product" />
                           ) : (
                              <img className="img-display" src={placeholderImage} alt=" product" />
                           )}
                        </Link>
                     </div>
                  </li>
               );
            })}
         </ol>
      </div>
   );
};

export default UserProducstDisplay;
