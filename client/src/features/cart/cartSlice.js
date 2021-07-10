import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action) => {
         const {
            payload: { product, quantity }
         } = action;
         const foundIdx = state.findIndex((item) => item.product.productId === product.productId);
         if (foundIdx === -1) state.push(action.payload);
         else state[foundIdx].quantity += quantity;
      }
   }
});

export const { addToCart } = cartSlice.actions;

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
