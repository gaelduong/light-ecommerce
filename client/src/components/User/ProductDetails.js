import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import placeholderImage from "../../assets/placeholder-image-2.png";

const ProductDetails = () => {
   const [product, setProduct] = useState(null);
   const { productId } = useParams();

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            console.log(productId);
            const { data } = await axios.get(`${apiUrl}/products/${productId}`);
            console.log("🚀 ~ file: ProductDetails.js ~ line 15 ~ fetchProduct ~ data", data);
            setProduct(data);
         } catch (error) {
            console.error(error);
         }
      };
      fetchProduct();
   }, [productId]);

   if (!product) return <></>;

   const price = {
      single_price: 12,
      price_variations: {
         variations: [
            {
               name: "color",
               values: ["red", "blue"]
            },
            {
               name: "size",
               values: ["L", "XL"]
            }
         ],
         prices: [
            { color: "red", size: "L", price: 10 },
            { color: "red", size: "XL", price: 20 },
            { color: "blue", size: "L", price: 10 },
            { color: "blue", size: "XL", price: 20 }
         ]
      }
   };

   const priceVariations = price.price_variations;
   const variationsElems = !priceVariations
      ? ""
      : priceVariations.variations.map(({ name, values }) => (
           <div>
              <p> {name}</p>
              {values.map((value) => (
                 <button> {value}</button>
              ))}
           </div>
        ));

   return (
      <React.Fragment>
         <Link to={`/products`}>
            <button> Back</button>{" "}
         </Link>
         {product.images.length > 0 ? (
            product.images.map((image) => <img key={image.order} className="img-display" src={image.imageAsBase64} alt=" product" />)
         ) : (
            <img className="img-display" src={placeholderImage} alt=" product" />
         )}
         <p>Name: {product.name}</p>
         <p>Price:{product.price}</p>
         <p>Description: {product.description}</p>
         <p>Category: {product.category}</p>
         <p>{product.isInStock ? "(In Stock)" : "(Out Of Stock)"}</p>

         {variationsElems}
      </React.Fragment>
   );
};

export default ProductDetails;
