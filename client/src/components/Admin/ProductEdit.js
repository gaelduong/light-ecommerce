import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image.png";
import { ImageInputList, VariationInput } from "../Common";
import {
   getFormattedVariations,
   getFormattedVariationPriceList,
   getUnformattedVariations,
   getUnformattedVariationPriceList
} from "../Common/PriceVariation/variationUtility.js";

const ProductEdit = ({ history }) => {
   const authVerified = useVerifyAuth(history);

   // Get product id from url
   const { productId } = useParams();

   const [productFields, setProductFields] = useState(null);

   const [variations, setVariations] = useState([]);

   const [variationPriceList, setVariationPriceList] = useState([]);

   const [imagesInput, setImagesInput] = useState(
      [...Array(6)].map((_, idx) => ({ order: idx, imageFile: null, inputKey: "", imageDisplay: placeholderImage }))
   );

   useEffect(() => {
      if (!productId) return;

      const fetchProduct = async () => {
         try {
            const { data } = await axios.get(`${apiUrl}/products_admin/${productId}`);
            // Load product fields
            const unFormattedVariations = getUnformattedVariations(data.price.multiplePrices?.variations);

            const unFormattedVariationPriceList = getUnformattedVariationPriceList(
               data.price.multiplePrices?.variationPriceList,
               unFormattedVariations
            );

            // Load variation input state
            setVariations(unFormattedVariations);
            setVariationPriceList(unFormattedVariationPriceList);
            // Set single price
            setProductFields({
               ...data,
               price: data.price.singlePrice || 0
            });
            // Load product images
            const productImages = data.images;
            const newImagesInput = imagesInput.map((imageInput, idx) => ({
               order: imageInput.order,
               path: (productImages[idx] && productImages[idx].path) || "",
               imageFile: null,
               inputKey: imageInput.inputKey,
               imageDisplay: (productImages[idx] && productImages[idx].imageAsBase64) || placeholderImage
            }));

            setImagesInput(newImagesInput);

            // Load price variations if exist
         } catch (error) {
            console.log("Error loading product");
         }
      };
      fetchProduct();
      // eslint-disable-next-line
   }, [productId]);

   const handleChange = (e) => {
      let value = e.target.value;
      let type = e.target.type;
      let name = e.target.name;

      if (type === "checkbox") {
         value = !productFields.isInStock;
      } else if (type === "number") {
         value = parseFloat(value);
      }
      const newProductFields = {
         ...productFields,
         [name]: value
      };

      setProductFields(newProductFields);
   };

   const handleEditProduct = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      for (const imageInput of imagesInput) {
         if (!imageInput.imageFile) continue;
         formData.append("image", imageInput.imageFile);
      }

      try {
         const { data } = await axios.post(`${apiUrl}/imageupload`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });

         const imagePaths = [];
         let order = 0;
         for (const imageInput of imagesInput) {
            if (imageInput.path) {
               imagePaths.push({ order: order++, path: imageInput.path });
               continue;
            }
            if (imageInput.imageFile) {
               imagePaths.push({ order: order++, path: data[0] });
               data.shift();
            }
         }

         const formattedVariations = getFormattedVariations(variations);

         const formattedVariationPriceList = getFormattedVariationPriceList(variationPriceList, variations);

         const priceInfo = {
            singlePrice: variations.length === 0 ? productFields.price : null,
            multiplePrices:
               variations.length > 0
                  ? {
                       variations: formattedVariations,
                       variationPriceList: formattedVariationPriceList
                    }
                  : null
         };

         const editedProduct = {
            name: productFields.name,
            price: priceInfo,
            description: productFields.description,
            category: productFields.category,
            isInStock: productFields.isInStock,
            images: imagePaths
         };
         await axios.put(`${apiUrl}/products_admin/${productId}`, editedProduct);

         // Redirect to admin main page once edit is done
         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         console.log(error);
      }
   };
   if (!authVerified || !productFields) return <></>;

   const { name, price, description, category, isInStock } = productFields;
   return (
      <AdminContainer history={history}>
         <h1> EDIT </h1>
         <form onSubmit={(e) => handleEditProduct(e)}>
            <label>
               * Name:
               <input type="text" name="name" value={name} onChange={handleChange} />
            </label>
            {variations.length === 0 && (
               <label>
                  * Price:
                  <input required type="number" name="price" step={0.1} min={0} value={price.toString()} onChange={handleChange} />
               </label>
            )}
            <VariationInput
               variations={variations}
               setVariations={setVariations}
               variationPriceList={variationPriceList}
               setVariationPriceList={setVariationPriceList}
            />
            <label>
               Description:
               <textarea name="description" value={description} onChange={handleChange} />
            </label>
            <label>
               * Category:
               <select required name="category" value={category} onChange={handleChange}>
                  <option value="A"> A</option>
                  <option value="B"> B</option>
                  <option value="C"> C</option>
                  <option value="D"> D</option>
               </select>
            </label>
            <label>
               * Is in stock:
               <input type="checkbox" name="isInStock" checked={isInStock} onChange={handleChange} />
            </label>

            <ImageInputList imagesInput={imagesInput} setImagesInput={setImagesInput} />

            <input className="bg-color-green" type="submit" value="Update" />
            <button
               className="bg-color-red"
               onClick={() => {
                  history.push("/admin");
               }}
            >
               Discard
            </button>
         </form>
      </AdminContainer>
   );
};

export default ProductEdit;
