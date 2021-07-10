import React from "react";
import { useSelector } from "react-redux";

const Cart = () => {
   const cart = useSelector((state) => state.cart);

   if (cart.length === 0) return <> Your cart is empty </>;

   return (
      <div>
         <h3> Cart </h3>
         {cart.map((item) => (
            <div key={item.product.productId}>
               <span>
                  <img className="img-display" src={item.product.image} alt="product" />
               </span>
               <span> {item.product.name}</span>
               <span> {item.product.price}</span>
               <span> Qty: {item.quantity} </span>
            </div>
         ))}
         <button> Checkout (COD) </button>
      </div>
   );
};

export default Cart;
