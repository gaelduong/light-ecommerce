import React from "react";
import { getVariationPriceList } from "./variationUtility.js";
import { generateRandomKey } from "../commonUtility.js";

const VariationOptionInput = ({ variation, idx, variations, setVariations, variationPriceList, setVariationPriceList }) => {
   const handleAddVariationOption = (id) => {
      const newVariations = variations.map((variation) => {
         if (variation.id === id) {
            variation.options.push({ optionId: generateRandomKey(), value: "" });
         }
         return variation;
      });

      const newVariationPriceList = getVariationPriceList(newVariations, variationPriceList);
      setVariationPriceList(newVariationPriceList);

      setVariations(newVariations);
   };

   const handleVariationNameChange = (e, idx) => {
      const newVariations = [...variations];
      newVariations[idx].variationName = e.target.value;
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

      const newVariationPriceList = getVariationPriceList(newVariations, variationPriceList);
      setVariationPriceList(newVariationPriceList);

      setVariations(newVariations);
   };

   const handleDeleteVariation = (id) => {
      const newVariations = [...variations].filter((variation) => variation.id !== id);
      const newVariationPriceList = getVariationPriceList(newVariations, variationPriceList);
      setVariationPriceList(newVariationPriceList);
      setVariations(newVariations);
   };
   return (
      <div>
         {`Variation ${idx + 1}`}
         <div className="variation-container">
            <label>
               Variation name:
               <input
                  required
                  type="text"
                  placeholder="Variation name: size, color, etc."
                  value={variations[idx].variationName}
                  onChange={(e) => handleVariationNameChange(e, idx)}
               />
               <div>
                  Options:
                  {variation.options.map((option, idx2) => (
                     <div className="variation-options-container" key={option.optionId}>
                        <input
                           required
                           type="text"
                           placeholder="Variation option: red, large, etc."
                           value={variation.options[idx2].value}
                           onChange={(e) => handleVariationOptionChange(e, idx, idx2)}
                        />
                        {variation.options.length > 1 && (
                           <button
                              className="delete-variation-option"
                              type="button"
                              onClick={() => handleDeleteVariationOption(idx, option.optionId)}
                           >
                              x
                           </button>
                        )}
                     </div>
                  ))}
               </div>
            </label>
            <button className="delete-variation" onClick={() => handleDeleteVariation(variation.id)}>
               ❌
            </button>
            <button type="button" onClick={() => handleAddVariationOption(variation.id)}>
               + Add options
            </button>
         </div>
      </div>
   );
};

export default VariationOptionInput;
