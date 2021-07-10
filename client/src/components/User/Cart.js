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
         {cart.items.map(({ product, quantity, subTotal }) => (
            <div key={product.productId + JSON.stringify(product.variation)}>
               <span>
                  <img className="img-display" src={product.image} alt="product" />
               </span>
               <span> {product.name}</span>
               <span> Subtotal: {subTotal}</span>
               <span> {Object.entries(product.variation).map((v) => v + " ")}</span>
               <span> Quantity: </span>
               <span>
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
               </span>
               &ensp;
               <button
                  className="inline"
                  onClick={() => dispatch(deleteCartItem({ productId: product.productId, productVariation: product.variation }))}
               >
                  Delete
               </button>
            </div>
         ))}
         <div>Total: {cart.total}</div>
         <button> Checkout (COD) </button>
      </div>
   );
};

export default Cart;
