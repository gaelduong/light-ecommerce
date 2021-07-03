import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image.png";
import { ProductFieldsInput } from "../Common";
import { getFormattedVariations, getFormattedVariationPriceList } from "../Common/PriceVariation/variationUtility.js";

const ProductAdd = ({ history }) => {
   const authVerified = useVerifyAuth(history);

   const [productFields, setProductFields] = useState({
      name: "",
      price: 0,
      description: "",
      category: "",
      isInStock: true
   });
   const [variations, setVariations] = useState([]);
   const [variationPriceList, setVariationPriceList] = useState([]);
   const [imagesInput, setImagesInput] = useState(
      [...Array(6)].map((_, idx) => ({ order: idx, imageFile: null, inputKey: "", imageDisplay: placeholderImage }))
   );

   const handleAddProduct = async (e) => {
      e.preventDefault();

      // Upload image to server
      const formData = new FormData();
      imagesInput.forEach((imageInput) => {
         formData.append("image", imageInput.imageFile);
      });

      try {
         const { data } = await axios.post(`${apiUrl}/imageupload`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });

         const imageOrderPathList = data.map((imagePath, idx) => ({
            order: idx,
            path: imagePath
         }));

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

         // Send POST request to add new product to DB
         await axios.post(`${apiUrl}/products_admin`, {
            name: productFields.name,
            price: priceInfo,
            description: productFields.description,
            category: productFields.category,
            isInStock: productFields.isInStock,
            images: imageOrderPathList
         });

         // Redirect to admin main page once add is done
         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         return console.log(error);
      }
   };

   if (!authVerified) return <></>;

   return (
      <AdminContainer history={history}>
         <h1> ADD PRODUCT </h1>
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
            handleAction={handleAddProduct}
            isEdit={false}
         />
      </AdminContainer>
   );
};

export default ProductAdd;
