import React from "react";
import { getVariationPriceByIds } from "./variationUtility.js";

const VariationPriceTable = ({ variations, variationPriceList, setVariationPriceList }) => {
   const handleVariationPriceChange = (e, ids) => {
      const newVariationPriceList = [...variationPriceList];
      const variationPrice = getVariationPriceByIds(ids, newVariationPriceList);
      variationPrice.price = parseFloat(e.target.value);
      setVariationPriceList(newVariationPriceList);
   };

   return (
      <React.Fragment>
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
                                    value={getVariationPriceByIds([option.optionId, option2.optionId], variationPriceList).price.toString()}
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
      </React.Fragment>
   );
};

export default VariationPriceTable;
