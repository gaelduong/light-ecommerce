import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
   return (
      <div>
         <h1> Hero section </h1>
         <p> (image) </p>
         <h1> How it works </h1>
         <p> Step 1: Select products to buy </p>
         <p> Step 2a:</p>
         <p> Pay without Card (no login required): </p>
         <p>Provide your address and phone number - We contact you to confirm order - We deliver</p>
         <p> Step 2b:</p>
         <p> Pay with Card: </p>
         <p> ... </p>

         <h1> Products</h1>
         <p> Show some products here...</p>
         <Link to={"/products"}>
            <button> Explore products </button>
         </Link>
      </div>
   );
};

export default Home;
