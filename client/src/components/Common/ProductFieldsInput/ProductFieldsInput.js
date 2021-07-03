import React from "react";
import { ImageInputList, VariationInput } from "../";

const ProductFieldsInput = ({
   history,
   productFields,
   setProductFields,
   imagesInput,
   setImagesInput,
   variations,
   setVariations,
   variationPriceList,
   setVariationPriceList,
   handleAction,
   isEdit
}) => {
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

   const { name, price, description, category, isInStock } = productFields;

   return (
      <form onSubmit={(e) => handleAction(e)}>
         <ImageInputList imagesInput={imagesInput} setImagesInput={setImagesInput} />

         <label>
            * Name:
            <input type="text" name="name" value={name} onChange={handleChange} />
         </label>

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

         <label> Price Info</label>
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

         <br />
         <input className="bg-color-green" type="submit" value={isEdit ? "Update" : "Add product"} />
         <button
            className="bg-color-red"
            onClick={() => {
               history.push("/admin");
            }}
         >
            Discard
         </button>
      </form>
   );
};

export default ProductFieldsInput;
