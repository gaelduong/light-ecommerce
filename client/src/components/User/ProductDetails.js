import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import placeholderImage from "../../assets/placeholder-image-2.png";

const priceEx = {
   singlePrice: 12,
   multiplePrices: {
      variations: [
         { name: "color", values: ["red", "blue"] },
         { name: "size", values: ["L", "XL"] }
      ],
      variationPriceList: [
         { color: "red", size: "L", price: 11 },
         { color: "red", size: "XL", price: 20 },
         { color: "blue", size: "L", price: 14 },
         { color: "blue", size: "XL", price: 25 }
      ]
   }
};

const ProductDetails = () => {
   const [product, setProduct] = useState(null);
   const [variationSelection, setVariationSelection] = useState({});
   const [displayPrice, setDisplayPrice] = useState(0);

   const { productId } = useParams();

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            const { data } = await axios.get(`${apiUrl}/products/${productId}`);
            console.log("🚀 ~ file: ProductDetails.js ~ line 15 ~ fetchProduct ~ data", data);
            // if(data.price.singlePrice){
            //      return setDisplayPrice(data.price.singlePrice)
            // } else
            const defaultPrice = priceEx.multiplePrices.variationPriceList[0].price;
            setDisplayPrice(defaultPrice);
            // Default variation selection
            const variationSelection = priceEx.multiplePrices.variations.reduce((obj, item) => Object.assign(obj, { [item.name]: item.values[0] }), {});
            setVariationSelection(variationSelection);
            setProduct(data);
         } catch (error) {
            console.error(error);
         }
      };
      fetchProduct();
   }, [productId]);

   useEffect(() => {
      if (!product) return;
      if (!priceEx.multiplePrices) return;
      // Get the corresponding price based on selected varations
      const variationPriceList = priceEx.multiplePrices.variationPriceList;
      const currentVariationPrice = variationPriceList.find((variationPrice) => {
         return Object.entries(variationPrice).every(([prop, value]) => value === variationSelection[prop] || prop === "price");
      });

      setDisplayPrice(currentVariationPrice.price);
   }, [product, variationSelection]);

   const handleSelection = (e) => {
      setVariationSelection({
         ...variationSelection,
         [e.target.name]: e.target.value
      });
   };

   const variationsElems =
      priceEx.multiplePrices &&
      priceEx.multiplePrices.variations.map(({ name, values }) => (
         <div key={name}>
            <p> {name}</p>
            {values.map((value) => (
               <button
                  key={value}
                  name={name}
                  value={value}
                  style={{ display: "inline", margin: "0 5px 0 0", background: variationSelection && variationSelection[name] === value ? "yellowgreen" : "" }}
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
