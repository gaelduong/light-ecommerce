import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItemQuantity, deleteCartItem } from "../../features/cart/cartSlice.js";

const Cart = () => {
   const cart = useSelector((state) => state.cart);
   const dispatch = useDispatch();

   if (cart.length === 0) return <> Your cart is empty </>;

   return (
      <div>
         <h3> Cart </h3>
         {cart.map(({ product, quantity }) => (
            <div key={product.productId + JSON.stringify(product.variation)}>
               <span>
                  <img className="img-display" src={product.image} alt="product" />
               </span>
               <span> {product.name}</span>
               <span> {product.price}</span>
               <span> {JSON.stringify(product.variation)}</span>
               <span> Quantity: </span>
               <button
                  className="inline"
                  onClick={() => {
                     if (quantity - 1 === 0) {
                        return dispatch(deleteCartItem({ productId: product.productId, productVariation: product.variation }));
                     }
                     dispatch(updateCartItemQuantity({ productId: product.productId, productVariation: product.variation, quantity: quantity - 1 }));
                  }}
               >
                  -
               </button>
               <span> {quantity} </span>
               <button
                  className="inline"
                  onClick={() =>
                     dispatch(updateCartItemQuantity({ productId: product.productId, productVariation: product.variation, quantity: quantity + 1 }))
                  }
               >
                  +
               </button>
               &ensp;
               <button
                  className="inline"
                  onClick={() => dispatch(deleteCartItem({ productId: product.productId, productVariation: product.variation }))}
               >
                  Delete
               </button>
            </div>
         ))}
         <button> Checkout (COD) </button>
      </div>
   );
};

export default Cart;
