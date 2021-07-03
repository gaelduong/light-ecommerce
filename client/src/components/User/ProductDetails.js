import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import placeholderImage from "../../assets/placeholder-image.png";

const ProductDetails = () => {
   const [product, setProduct] = useState(null);
   const [variationSelection, setVariationSelection] = useState({});
   const [displayPrice, setDisplayPrice] = useState(0);

   const { productId } = useParams();

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const { data } = await axios.get(`${apiUrl}/products/${productId}`);

            const productPrice = data.price;

            let displayPrice = -1;
            if (productPrice.singlePrice) {
               displayPrice = productPrice.singlePrice;
            } else if (productPrice.multiplePrices) {
               const defaultPrice = productPrice.multiplePrices.variationPriceList[0].price;
               setDisplayPrice(defaultPrice);
               displayPrice = productPrice.multiplePrices.variations.reduce((obj, item) => Object.assign(obj, { [item.name]: item.values[0] }), {});
            }

            setVariationSelection(displayPrice);
            setProduct(data);
         } catch (error) {
            console.error(error);
         }
      };
      fetchProduct();
   }, [productId]);

   useEffect(() => {
      if (!product) return;
      if (!product.price.multiplePrices) return;
      // Get the corresponding price based on selected varations
      const variationPriceList = product.price.multiplePrices.variationPriceList;
      const currentVariationPrice = variationPriceList.find(({ options }) => {
         const values = Object.values(variationSelection);
         return options[0] === values[0] && options[1] === values[1];
      });

      setDisplayPrice(currentVariationPrice.price);
   }, [product, variationSelection]);

   const handleSelection = (e) => {
      setVariationSelection({
         ...variationSelection,
         [e.target.name]: e.target.value
      });
   };

   const variationsElems = product?.price?.multiplePrices?.variations?.map(({ name, values }) => (
      <div key={name}>
         <p> {name}</p>
         {values.map((value) => (
            <button
               key={value}
               name={name}
               value={value}
               style={{
                  display: "inline",
                  margin: "0 5px 0 0",
                  background: variationSelection && variationSelection[name] === value ? "yellowgreen" : ""
               }}
               onClick={handleSelection}
            >
               {value}
            </button>
         ))}
      </div>
   ));

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
         <p>Price: {displayPrice}</p>
         {variationsElems}
         <p>Description: {product.description}</p>
         <p>Category: {product.category}</p>
         <p>{product.isInStock ? "(In Stock)" : "(Out Of Stock)"}</p>
      </React.Fragment>
   );
};

export default ProductDetails;
