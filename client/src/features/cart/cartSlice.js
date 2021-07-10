import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const sameVariation = (v1, v2) => JSON.stringify(v1) === JSON.stringify(v2);

export const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action) => {
         const {
            payload: { product, quantity }
         } = action;
         const sameItemIdx = state.findIndex(
            (item) => item.product.productId === product.productId && sameVariation(item.product.variation, product.variation)
         );
         if (sameItemIdx === -1) state.push(action.payload);
         else state[sameItemIdx].quantity += quantity;
      },
      updateCartItemQuantity: (state, action) => {
         const {
            payload: { productId, productVariation, quantity }
         } = action;

         state = state.map((item) => {
            if (item.product.productId === productId && sameVariation(item.product.variation, productVariation)) {
               return { product: item.product, quantity };
            }
            return item;
         });
         return state;
      },
      deleteCartItem: (state, action) => {
         const {
            payload: { productId, productVariation }
         } = action;
         const foundIdx = state.findIndex((item) => item.product.productId === productId && sameVariation(item.product.variation, productVariation));
         if (foundIdx === -1) return;
         state.splice(foundIdx, 1);
      }
   }
});

export const { addToCart, updateCartItemQuantity, deleteCartItem } = cartSlice.actions;

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
