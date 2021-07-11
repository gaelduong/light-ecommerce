import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cart")) || {
   items: [],
   total: 0
};

const sameVariation = (v1, v2) => JSON.stringify(v1) === JSON.stringify(v2);

export const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action) => {
         const {
            payload: { product, quantity }
         } = action;
         const sameItemIdx = state.items.findIndex(
            (item) => item.product.productId === product.productId && sameVariation(item.product.variation, product.variation)
         );
         if (sameItemIdx === -1) state.items.push({ product, quantity, subTotal: quantity * product.price });
         else {
            state.items[sameItemIdx].quantity += quantity;
            state.items[sameItemIdx].subTotal += quantity * product.price;
         }
         state.total += quantity * product.price;
         localStorage.setItem("cart", JSON.stringify(state));
      },
      updateCartItemQuantity: (state, action) => {
         const {
            payload: { productId, productVariation, quantity }
         } = action;

         state.items = state.items.map((item) => {
            if (item.product.productId === productId && sameVariation(item.product.variation, productVariation)) {
               state.total += (quantity - item.quantity) * item.product.price;
               return { product: item.product, quantity, subTotal: item.product.price * quantity };
            }
            return item;
         });
         localStorage.setItem("cart", JSON.stringify(state));
         return state;
      },
      deleteCartItem: (state, action) => {
         const {
            payload: { productId, productVariation }
         } = action;
         const foundIdx = state.items.findIndex(
            (item) => item.product.productId === productId && sameVariation(item.product.variation, productVariation)
         );
         if (foundIdx === -1) return;
         state.total -= state.items[foundIdx].subTotal;
         state.items.splice(foundIdx, 1);
         localStorage.setItem("cart", JSON.stringify(state));
      }
   }
});

export const { addToCart, updateCartItemQuantity, deleteCartItem } = cartSlice.actions;

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
