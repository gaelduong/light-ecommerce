import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItemQuantity, deleteCartItem } from "../../features/cart/cartSlice.js";

const Cart = () => {
   const cart = useSelector((state) => state.cart);
   const dispatch = useDispatch();

   if (cart.items.length === 0) return <> Your cart is empty </>;

   return (
      <div>
         <h3> Cart </h3>
         <table>
            <tbody>
               {cart.items.map(({ product, quantity, subTotal }) => (
                  <tr key={product.productId + JSON.stringify(product.variation)}>
                     <td>
                        <img className="img-display" src={product.image} alt="product" />
                     </td>
                     <td> {product.name}</td>
                     <td>
                        {Object.entries(product.variation).map(([variationName, value]) => (
                           <div key={`${variationName}-${value}`}>
                              {variationName}: {value}
                           </div>
                        ))}
                     </td>
                     <td>
                        <button
                           className="inline"
                           onClick={() => {
                              if (quantity - 1 === 0) {
                                 return dispatch(deleteCartItem({ productId: product.productId, productVariation: product.variation }));
                              }
                              dispatch(
                                 updateCartItemQuantity({ productId: product.productId, productVariation: product.variation, quantity: quantity - 1 })
                              );
                           }}
                        >
                           -
                        </button>
                        <span> {quantity} </span>
                        {/* <input
                     style={{ width: "32px", textAlign: "center" }}
                     className="inline"
                     type="tel"
                     min="1"
                     max="50"
                     value={quantity}
                     onChange={(e) =>
                        dispatch(
                           updateCartItemQuantity({
                              productId: product.productId,
                              productVariation: product.variation,
                              quantity: !e.target.value ? 1 : parseFloat(e.target.value)
                           })
                        )
                     }
                  /> */}
                        <button
                           className="inline"
                           onClick={() =>
                              dispatch(
                                 updateCartItemQuantity({ productId: product.productId, productVariation: product.variation, quantity: quantity + 1 })
                              )
                           }
                        >
                           +
                        </button>
                     </td>
                     <td> {subTotal} USD </td>
                     <td>
                        <button
                           className="inline"
                           onClick={() => dispatch(deleteCartItem({ productId: product.productId, productVariation: product.variation }))}
                        >
                           ❌
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div>Total: {cart.total} USD </div>
         <button> Checkout (COD) </button>
      </div>
   );
};

export default Cart;
