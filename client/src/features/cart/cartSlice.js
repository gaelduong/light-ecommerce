import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action) => {
         state.push(action.payload);
      }
   }
});

// Action creators are generated for each case reducer function
export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
