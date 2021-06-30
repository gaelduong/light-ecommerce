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
      </React.Fragment>
   );
};

export default ProductDetails;
