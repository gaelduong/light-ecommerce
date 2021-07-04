import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image.png";
import { ProductFieldsInput } from "../Common";
import {
   getFormattedVariations,
   getFormattedVariationPriceList,
   getUnformattedVariations,
   getUnformattedVariationPriceList
} from "../Common/PriceVariation/variationUtility.js";
import { getFormattedImagePaths } from "../Common/ImageInput/imageUtility.js";
import { getCookieValue } from "../../shared/util.js";

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
            const { data } = await axios.get(`${apiUrl}/products_admin/${productId}`, {
               headers: {
                  Authorization: `Bearer ${getCookieValue("accessToken")}`
               }
            });
            const unFormattedVariations = getUnformattedVariations(data.price.multiplePrices?.variations);

            const unFormattedVariationPriceList = getUnformattedVariationPriceList(
               data.price.multiplePrices?.variationPriceList,
               unFormattedVariations
            );

            // Load price variation input state
            setVariations(unFormattedVariations);
            setVariationPriceList(unFormattedVariationPriceList);

            // Load single price and other product fields
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
            console.error("Error loading product");
         }
      };
      fetchProduct();
      // eslint-disable-next-line
   }, [productId]);

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

         const formattedImagePaths = getFormattedImagePaths(imagesInput, data);

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

         // Send PUT request to update product in DB
         await axios.put(
            `${apiUrl}/products_admin/${productId}`,
            {
               name: productFields.name,
               price: priceInfo,
               description: productFields.description,
               category: productFields.category,
               isInStock: productFields.isInStock,
               images: formattedImagePaths
            },
            {
               headers: {
                  Authorization: `Bearer ${getCookieValue("accessToken")}`
               }
            }
         );

         // Redirect to admin main page once edit is done
         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         console.log(error);
      }
   };
   if (!authVerified || !productFields) return <></>;

   return (
      <AdminContainer history={history}>
         <h1> EDIT </h1>
         <ProductFieldsInput
            history={history}
            productFields={productFields}
            setProductFields={setProductFields}
            imagesInput={imagesInput}
            setImagesInput={setImagesInput}
            variations={variations}
            setVariations={setVariations}
            variationPriceList={variationPriceList}
            setVariationPriceList={setVariationPriceList}
            handleAction={handleEditProduct}
            isEdit={true}
         />
      </AdminContainer>
   );
};

export default ProductEdit;
