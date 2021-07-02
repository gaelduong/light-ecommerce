import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import useVerifyAuth from "../../hooks/useVerifyAuth.js";
import AdminContainer from "./AdminContainer.js";
import placeholderImage from "../../assets/placeholder-image.png";
import { ImageInputList } from "../Common";

const generateRandomKey = () => {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
         v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
   });
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

   const [imagesInput, setImagesInput] = useState([...Array(6)].map((_, idx) => ({ order: idx, imageFile: null, inputKey: "", imageDisplay: placeholderImage })));

   const [variations, setVariations] = useState([]);

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

   const handleTurnOffVariations = () => {
      setVariations([]);
   };

   const handleCreateVariation = () => {
      const newVariation = { variationName: "", options: [{ optionId: generateRandomKey(), value: "" }], id: generateRandomKey() };
      setVariations([...variations, newVariation]);
   };

   const handleAddVariationOption = (id) => {
      const newVariations = variations.map((variation) => {
         if (variation.id === id) {
            variation.options.push({ optionId: generateRandomKey(), value: "" });
         }
         return variation;
      });
      setVariations(newVariations);
   };

   const handleVariationNameChange = (e, idx) => {
      const newVariations = [...variations];
      newVariations[idx].variationName = e.target.value;
      console.log("🚀 ~ file: ProductAdd.js ~ line 50 ~ handleVariationNameChange ~ newVariations", newVariations);
      setVariations(newVariations);
   };

   const handleVariationOptionChange = (e, variationIdx, idx) => {
      const newVariations = [...variations];
      newVariations[variationIdx].options[idx].value = e.target.value;
      setVariations(newVariations);
   };

   const handleDeleteVariationOption = (variationIdx, optionId) => {
      const newVariations = [...variations];
      newVariations[variationIdx].options = newVariations[variationIdx].options.filter((option) => option.optionId !== optionId);
      setVariations(newVariations);
   };

   const handleDeleteVariation = (id) => {
      const newVariations = [...variations].filter((variation) => variation.id !== id);
      console.log("🚀 ~ file: ProductAdd.js ~ line 90 ~ handleDeleteVariation ~ newVariations", newVariations);
      setVariations(newVariations);
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

         const priceEx = {
            // singlePrice: 12
            multiplePrices: {
               variations: [
                  { name: "storage", values: ["128gb", "256gb"] },
                  { name: "ram", values: ["16gb", "32gb"] }
               ],
               variationPriceList: [
                  { options: ["128gb", "16gb"], price: 11 },
                  { options: ["128gb", "32gb"], price: 20 },
                  { options: ["256gb", "16gb"], price: 14 },
                  { options: ["256gb", "32gb"], price: 25 }
               ]
            }
         };
         // Send POST request to add new product to DB
         await axios.post(`${apiUrl}/products_admin`, {
            name: productFields.name,
            price: priceEx,
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

   const variationForm = (
      <div>
         <button type="button" onClick={handleTurnOffVariations}>
            Turn off variations
         </button>
         {variations.map((variation, idx) => (
            <div key={variation.id}>
               <button style={{ display: "inline" }} onClick={() => handleDeleteVariation(variation.id)}>
                  x
               </button>
               <label>
                  {`Variation ${idx + 1}`}:
                  <input
                     required
                     type="text"
                     placeholder="Variation name: size, color, etc."
                     value={variations[idx].variationName}
                     onChange={(e) => handleVariationNameChange(e, idx)}
                  />
                  Options:
                  {variation.options.map((option, idx2) => (
                     <div key={option.optionId}>
                        <input
                           required
                           type="text"
                           placeholder="Variation option: red, large, etc."
                           value={variation.options[idx2].value}
                           onChange={(e) => handleVariationOptionChange(e, idx, idx2)}
                        />
                        {idx2 >= 1 && (
                           <button type="button" onClick={() => handleDeleteVariationOption(idx, option.optionId)}>
                              x
                           </button>
                        )}
                     </div>
                  ))}
               </label>
               <button type="button" onClick={() => handleAddVariationOption(variation.id)}>
                  + Add options
               </button>
               <hr />
            </div>
         ))}
         <button onClick={handleCreateVariation} type="button">
            Add more variation
         </button>

         <p> Variation list </p>
         <table>
            <tbody>
               <tr>
                  <th>{variations[0]?.variationName || "Variation name"}</th>
                  {variations[1] && <th>{(variations[1] && variations[1].variationName) || "Variation name"}</th>}
                  <th>Price</th>
               </tr>
               {variations[0]?.options?.length > 0 &&
                  variations[0].options.map(({ value }) => (
                     <tr key={generateRandomKey()}>
                        <td>{value || "Option"} </td>

                        {variations[1] && (
                           <td>{variations[1].options && variations[1].options.map(({ value }) => <div key={generateRandomKey()}>{value || "Option"}</div>)}</td>
                        )}
                        <td>
                           {variations[1]?.options?.length > 0 ? (
                              variations[1].options.map((option) => (
                                 <input
                                    key={generateRandomKey()}
                                    // value={0}
                                    // onChange={() => {
                                    //    console.log("a");
                                    // }}
                                 />
                              ))
                           ) : (
                              <input
                                 key={generateRandomKey()}
                                 // value={0}
                                 // onChange={() => {
                                 //    console.log("a");
                                 // }}
                              />
                           )}
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
      </div>
   );

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
            {variations.length === 0 && <input required type="button" name="price" value="Enable variations" onClick={handleCreateVariation} />}
            {variations.length > 0 && variationForm}
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
