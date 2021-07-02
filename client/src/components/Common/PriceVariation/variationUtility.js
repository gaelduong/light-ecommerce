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
