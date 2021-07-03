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
         <div className="basic-info-container">
            <h2> Basic Info</h2>

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
                  <option value=""> Select Category</option>
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
         </div>
         <div className="price-info-container">
            <h2> Price Info</h2>
            <label>
               * Price:
               <input
                  disabled={variations.length === 0 ? false : true}
                  required
                  type={variations.length === 0 ? "number" : "text"}
                  name="price"
                  step={0.1}
                  min={0}
                  value={variations.length === 0 ? price.toString() : "(disabled)"}
                  onChange={handleChange}
               />
            </label>
            <VariationInput
               variations={variations}
               setVariations={setVariations}
               variationPriceList={variationPriceList}
               setVariationPriceList={setVariationPriceList}
            />
         </div>

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
