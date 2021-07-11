import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import placeholderImage from "../../assets/placeholder-image.png";
import { SearchBar } from "../Common";

function displayMinMaxPrice(variationPriceList) {
   const prices = variationPriceList.map((variationPrice) => variationPrice.price);
   const min = Math.min(...prices);
   const max = Math.max(...prices);
   if (min === max) return `${min} USD`;
   return `${min}-${max} USD`;
}

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
         <SearchBar setProducts={setProducts} isPrivate={false} />
         <ul>
            {products.map(({ _id, name, price, category, isInStock, images }) => {
               return (
                  <li key={_id}>
                     <div>
                        <Link to={`/product-details/${_id}`}>
                           {images.length > 0 ? (
                              <img key={images[0].order} className="img-display" src={images[0].imageAsBase64} alt=" product" />
                           ) : (
                              <img className="img-display" src={placeholderImage} alt=" product" />
                           )}
                        </Link>
                     </div>
                     <div> {name} </div>
                     <div> {(price.multiplePrices && displayMinMaxPrice(price.multiplePrices.variationPriceList)) || `${price.singlePrice}USD`}</div>
                     <div> Category: {category} </div>
                     <div> {isInStock ? "" : "(Out of stock)"} </div>
                     <br />
                  </li>
               );
            })}
         </ul>
      </div>
   );
};

export default UserProducstDisplay;
