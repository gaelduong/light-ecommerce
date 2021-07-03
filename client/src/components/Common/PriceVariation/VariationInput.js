import React from "react";
import VariationPriceTable from "./VariationPriceTable.js";
import VariationOptionInput from "./VariationOptionInput.js";
import { getVariationPriceList } from "./variationUtility.js";
import { generateRandomKey } from "../commonUtility.js";

const VariationInput = ({ variations, setVariations, variationPriceList, setVariationPriceList }) => {
   const handleTurnOffVariations = () => {
      setVariations([]);
   };

   const handleAddVariationName = () => {
      const newVariation = { variationName: "", options: [{ optionId: generateRandomKey(), value: "" }], id: generateRandomKey() };

      const newVariations = [...variations, newVariation];
      const newVariationPriceList = getVariationPriceList(newVariations, variationPriceList);
      setVariationPriceList(newVariationPriceList);
      setVariations(newVariations);
   };

   if (variations.length === 0)
      return (
         <>
            <span> Variations: </span>
            <input required type="button" name="price" value="Enable price variations" onClick={handleAddVariationName} />
         </>
      );
   return (
      <div className="variations-container">
         <div className="variations-container-left">
            <h3> Variations </h3>
            {variations.map((variation, idx) => (
               <VariationOptionInput
                  key={variation.id}
                  variation={variation}
                  idx={idx}
                  variations={variations}
                  setVariations={setVariations}
                  variationPriceList={variationPriceList}
                  setVariationPriceList={setVariationPriceList}
               />
            ))}
            {variations.length < 2 && (
               <button onClick={handleAddVariationName} type="button">
                  Add more variation
               </button>
            )}
         </div>
         <VariationPriceTable variations={variations} variationPriceList={variationPriceList} setVariationPriceList={setVariationPriceList} />
      </div>
   );
};

export default VariationInput;
