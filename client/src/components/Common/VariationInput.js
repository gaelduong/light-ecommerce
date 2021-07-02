import React from "react";

const generateRandomKey = () => {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
         v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
   });
};

const getVariationPriceByIds = (ids, variationPriceList) => {
   return variationPriceList.find(({ optionIds }) => JSON.stringify(optionIds) === JSON.stringify(ids));
};

const getVariationPriceList = (variations, variationPriceList) => {
   if (variations.length === 0) return [];
   const options1 = variations[0].options;
   const options2 = (variations[1] && variations[1].options) || [];
   const keys1 = options1.map(({ optionId }) => optionId);
   const keys2 = options2.map(({ optionId }) => optionId);

   let keyPairs = [];
   keys1.forEach((key1) => {
      if (keys2.length === 0) {
         keyPairs.push([key1]);
         return;
      }
      keys2.forEach((key2) => {
         keyPairs.push([key1, key2]);
      });
   });

   const newVariationPriceList = keyPairs.map((keyPair) => ({
      optionIds: keyPair,
      price: 0
   }));

   return newVariationPriceList.map((variationPrice) => {
      const existingVariationPrice = getVariationPriceByIds(variationPrice.optionIds, variationPriceList);
      if (existingVariationPrice) return existingVariationPrice;
      return variationPrice;
   });
};

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

   const handleVariationPriceChange = (e, ids) => {
      const newVariationPriceList = [...variationPriceList];
      const variationPrice = getVariationPriceByIds(ids, newVariationPriceList);
      variationPrice.price = "" + parseFloat(e.target.value);
      setVariationPriceList(newVariationPriceList);
   };

   if (variations.length === 0) return <input required type="button" name="price" value="Enable variations" onClick={handleAddVariationName} />;

   return (
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
         {variations.length < 2 && (
            <button onClick={handleAddVariationName} type="button">
               Add more variation
            </button>
         )}

         <p> Variation list </p>
         <table>
            <tbody>
               <tr>
                  <th>{variations[0]?.variationName || "Variation name"}</th>
                  {variations[1] && <th>{(variations[1] && variations[1].variationName) || "Variation name"}</th>}
                  <th>Price</th>
               </tr>
               {variations[0]?.options?.length > 0 &&
                  variations[0].options.map((option) => (
                     <tr key={option.optionId}>
                        <td>{option.value || "Option"} </td>

                        {variations[1] && (
                           <td>
                              {variations[1].options &&
                                 variations[1].options.map(({ value, optionId }) => <div key={optionId}>{value || "Option"}</div>)}
                           </td>
                        )}
                        <td>
                           {variations[1]?.options?.length > 0 ? (
                              variations[1].options.map((option2) => (
                                 <input
                                    required
                                    type="number"
                                    key={option2.optionId}
                                    value={getVariationPriceByIds([option.optionId, option2.optionId], variationPriceList).price}
                                    onChange={(e) => {
                                       handleVariationPriceChange(e, [option.optionId, option2.optionId]);
                                    }}
                                 />
                              ))
                           ) : (
                              <input
                                 required
                                 type="number"
                                 key={option.optionId}
                                 value={getVariationPriceByIds([option.optionId], variationPriceList).price}
                                 onChange={(e) => {
                                    handleVariationPriceChange(e, [option.optionId]);
                                 }}
                              />
                           )}
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
      </div>
   );
};

export default VariationInput;
