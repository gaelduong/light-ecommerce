import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image.png";
import { ImageInputList, VariationInput } from "../Common";

const getVariationValueById = (id, variations) => {
   for (const variation of variations) {
      const found = variation.options.find((option) => option.optionId === id);
      if (found) return found.value;
   }
   return "";
};

const ProductAdd = ({ history }) => {
   const authVerified = useVerifyAuth(history);

   const [productFields, setProductFields] = useState({
      name: "",
      price: 0,
      desc: "",
      category: "",
      isInStock: true
   });

   const [imagesInput, setImagesInput] = useState(
      [...Array(6)].map((_, idx) => ({ order: idx, imageFile: null, inputKey: "", imageDisplay: placeholderImage }))
   );

   const [variations, setVariations] = useState([]);

   const [variationPriceList, setVariationPriceList] = useState([]);

   const handleChange = (e) => {
      let value = e.target.value;
      let type = e.target.type;
      let name = e.target.name;

      if (type === "checkbox") {
         value = !productFields.isInStock;
      } else if (type === "number") {
         value = "" + parseFloat(value);
      }
      const newProductFields = {
         ...productFields,
         [name]: value
      };

      setProductFields(newProductFields);
   };

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

         console.log("🚀 ~ file: ProductAdd.js ~ line 94 ~ handleAddProduct ~ data", data);

         const formattedVariations = variations.map((variation) => ({
            name: variation.variationName,
            values: variation.options.map((option) => option.value)
         }));

         const formattedVariationPriceList = variationPriceList.map(({ optionIds, price }) => ({
            options: optionIds.map((id) => getVariationValueById(id, variations)),
            price
         }));

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
            description: productFields.desc,
            category: productFields.category,
            isInStock: productFields.isInStock,
            images: imageOrderPathList
         });

         setTimeout(() => {
            history.push("/admin");
         }, 200);
      } catch (error) {
         return console.log(error);
      }
   };

   if (!authVerified) return <></>;

   const { name, price, desc, category, isInStock } = productFields;
   return (
      <AdminContainer history={history}>
         <h1> ADD PRODUCT </h1>
         <form onSubmit={handleAddProduct}>
            <label>
               * Name:
               <input required type="text" name="name" value={name} onChange={handleChange} />
            </label>
            {variations.length === 0 && (
               <label>
                  * Price:
                  <input required type="number" name="price" step={0.1} min={0} value={price} onChange={handleChange} />
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
               <textarea name="desc" value={desc} onChange={handleChange} />
            </label>
            <label>
               * Category:
               <select required name="category" value={category} onChange={handleChange}>
                  <option value="">Choose category</option>
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

            <input className="bg-color-green" type="submit" value="Add product" />
         </form>
         <button className="bg-color-red" onClick={() => history.push("/admin")}>
            Discard
         </button>
      </AdminContainer>
   );
};

export default ProductAdd;
