import { generateUniqueId } from "../commonUtility.js";

function getVariationValueById(id, variations) {
   for (const variation of variations) {
      const found = variation.options.find((option) => option.optionId === id);
      if (found) return found.value;
   }
   return "";
}

function getIdByVariationValue(value, variations) {
   for (const variation of variations) {
      const found = variation.options.find((option) => option.value === value);
      if (found) return found.optionId;
   }
   return "";
}

export function getVariationPriceByIds(ids, variationPriceList) {
   return variationPriceList.find(({ optionIds }) => JSON.stringify(optionIds) === JSON.stringify(ids));
}

export function getVariationPriceList(variations, variationPriceList) {
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
}

export function getFormattedVariations(variations) {
   return variations.map((variation) => ({
      name: variation.variationName,
      values: variation.options.map((option) => option.value)
   }));
}

export function getFormattedVariationPriceList(variationPriceList, variations) {
   return variationPriceList.map(({ optionIds, price }) => ({
      options: optionIds.map((id) => getVariationValueById(id, variations)),
      price
   }));
}

export function getUnformattedVariations(formattedVariations) {
   if (!formattedVariations || formattedVariations.length === 0) return [];
   return formattedVariations.map((variation) => ({
      id: generateUniqueId(),
      variationName: variation.name,
      options: variation.values.map((value) => ({ optionId: generateUniqueId(), value }))
   }));
}

export function getUnformattedVariationPriceList(formattedVariationPriceList, variations) {
   if (!formattedVariationPriceList || formattedVariationPriceList.length === 0) return [];
   return formattedVariationPriceList.map((variationPrice) => ({
      optionIds: variationPrice.options.map((value) => getIdByVariationValue(value, variations)),
      price: variationPrice.price
   }));
}
